const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
//const sequelize = require('./db/conn');
const db = require('./db/conn.js');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { verifyToken } = require('./middleware/VerifyToken');
const { Register, Login, getUsers, Logout, ForgotPassword, ResetPassword } = require('./controller/UserController');
const prefix = '/v1/api/';

// User API
app.get(prefix + 'users', getUsers);
app.post(prefix + 'register', Register);
app.post(prefix + 'login', Login);
app.delete(prefix + 'logout', Logout);
app.post(prefix + 'forgotPassword', ForgotPassword);
app.post(prefix + 'reset-password', ResetPassword);

// Sinkronisasi model dengan database
sequelize.sync();
app.listen(5000 || process.env.PORT, '0.0.0.0', () => {
  console.log('Server Started');
});
