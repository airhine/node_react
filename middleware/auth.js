const jwt = require('jsonwebtoken');
const { User } = require('../models/User');  // ✅ User 모델 import

let auth = async (req, res, next) => {
  try {
    const token = req.cookies.x_auth;
    if (!token) {
      return res.status(401).json({ isAuth: false, message: '토큰 없음' });
    }

    // generateToken에서 사용한 secret과 동일해야 합니다.
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');

    // 토큰과 user를 동시에 확인
    const user = await User.findOne({ _id: decoded._id, token }).exec();
    if (!user) {
      return res.status(401).json({ isAuth: false, message: '유효하지 않은 토큰' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ isAuth: false, error: err.message });
  }
};

module.exports = { auth };
