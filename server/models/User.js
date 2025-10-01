const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, minlength: 4 },
  token: { type: String },
}, { timestamps: true });

// 비번 해시
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (e) {
    next(e);
  }
});

// 콜백 X, Promise 반환
userSchema.methods.comparePassword = async function(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.generateToken = async function() {
  const payload = { _id: this._id.toString() };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  this.token = token;
  await this.save();      // 토큰을 DB에 저장하려면 유지
  return token;           // 로그인 응답에 쓸 값
};

userSchema.statics.findByToken = async function(token) {
  var user = this;
  jwt.verify(token, 'secretToken', function(err, decoded) {
    user.findOne({"_id": decoded, "token": token, function(err, user){
        if(err) return cb(err);
        cb(null, user);
    }})

  });
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
