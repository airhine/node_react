const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { User } = require('./models/User');
const { auth } = require('./middleware/auth')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// connect (옵션은 상황에 맞게)
mongoose.connect(config.mongoURI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

app.get('/', (req, res) => res.send('Hello World! test'));

// 회원가입 (콜백 제거)
app.post('/api/users/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();                   // 콜백 X
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ success: false, err: err?.message || err });
  }
});

// 로그인 (콜백 제거)
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();  // 콜백 X
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '찾고자 하는 이메일 해당 유저 없음',
      });
    }

    const isMatch = await user.comparePassword(password);  // 프로미스 메서드여야 함
    if (!isMatch) {
      return res.json({ loginSuccess: false, message: '비밀번호 오류' });
    }

    const token = await user.generateToken();  // 프로미스 메서드여야 함

    res
      .cookie('x_auth', token, {
        httpOnly: true,
        sameSite: 'lax',
        // secure: true, // HTTPS만 쓰면 활성화
        // maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ loginSuccess: true, userId: user._id });
  } catch (err) {
    return res.status(400).json({ success: false, err: err?.message || err });
  }
});

app.get('/api/users/auth', auth, async (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

// ✅ POST 로그아웃: 콜백 제거 버전
app.get('/api/users/logout', auth, async (req, res) => {
  try {
    // 방법 1) updateOne
    await User.updateOne({ _id: req.user._id }, { $set: { token: '' } }).exec();

    // 방법 2) findOneAndUpdate도 가능 (콜백X, await/exec 사용)
    // await User.findOneAndUpdate(
    //   { _id: req.user._id },
    //   { $set: { token: '' } },
    //   { new: true }
    // ).exec();

    res.clearCookie('x_auth');
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('logout error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
