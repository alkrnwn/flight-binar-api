const { users } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.getUsers = async (req, res) => {
  try {
    const Users = await users.findAll({
      attributes: ['id', 'username', 'email', 'nama_lengkap', 'alamat', 'nomor_telepon'],
    });
    res.status(200).json({
      success: true,
      message: 'List All Users',
      data: Users,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.Register = async (req, res) => {
  // console.log(req.body)
  const { username, password, nama_lengkap, alamat, email, nomor_telepon } = req.body;

  const emailExisted = await users.findOne({
    where: {
      email: email,
    },
  });

  if (emailExisted) {
    return res.status(409).json({
      status: false,
      msg: 'Email already exists',
    });
  }
  const salt = 10;
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    let user = await users.create({
      username: username,
      password: hashPassword,
      nama_lengkap: nama_lengkap,
      alamat: alamat,
      email: email,
      nomor_telepon: nomor_telepon,
    });

    user = JSON.parse(JSON.stringify(user));

    return res.status(200).json({
      success: true,
      message: 'Register Successfully',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.Login = async (req, res) => {
  try {
    let user = await users.findOne({
      where: {
        email: req.body.email,
      },
    });

    user = JSON.parse(JSON.stringify(user));

    if (!user) return res.status(400).json({ success: false, message: "Email or Password didn't match" });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ success: false, message: 'Wrong Password' });

    //token generation
    let refreshTokens = [];

    const userId = user.id;
    const email = user.email;
    const nama_lengkap = user.nama_lengkap;

    const tokenParams = { userId, email, nama_lengkap };

    const accessToken = jwt.sign(tokenParams, 'access', {
      expiresIn: '1d',
    });
    const refreshToken = jwt.sign(tokenParams, 'refresh', {
      expiresIn: '1d',
    });
    refreshTokens.push(refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const data = {
      userId,
      email,
      nama_lengkap,
      accessToken,
      refreshToken,
    };

    return res.status(201).json({
      success: true,
      message: 'Login Successfully',
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: 'Login Failed' });
  }
};

exports.Logout = (req, res) => {
  try {
    res.clearCookie('accessToken');

    res.clearCookie('refreshToken');

    return res.status(200).json({
      success: true,
      message: 'Logout Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Logout Failed' });
  }
};

exports.ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await users.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Email not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ email }, 'reset', { expiresIn: '1h' });

    // Save reset token to user record
    user.resetToken = resetToken;
    await user.save();

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'irfananwar459@gmail.com',
        pass: 'wsfpsbrmwntkqfhl',
      },
    });

    const mailOptions = {
      from: 'BackEnd Kelompok 6',
      to: email,
      subject: 'Password Reset',
      text:
        `You are receiving this email because you requested a password reset for your account.\n\n` +
        `Please click on the following link to reset your password:\n\n` +
        `https://your-website.com/reset-password/${resetToken}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to send reset email' });
      }
      console.log('Reset email sent:', info.response);

      return res.status(200).json({ success: true, message: 'Reset email sent' });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Forgot password failed' });
  }
};

exports.ResetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const decodedToken = jwt.verify(resetToken, 'reset');

    const { email } = decodedToken;

    const user = await users.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Email not found' });
    }

    const salt = 10;
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetToken = null;

    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Password reset failed' });
  }
};
