import { Router } from "express";
import { check } from "express-validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import { validateRequest } from './../helper/index.js'

const router = Router();

/* POST register user. */
const sanitizeRegister = [
  check('email')
  .isEmail()
  .withMessage("Geçersiz Email"),
  check('password')
  .isLength({ min: 8 })
  .withMessage("Şifre Minimum 8 karakter olmalı")
]
router.post('/register', sanitizeRegister, async (req, res, next) => {
  const { email, password } = req.body;
  try {
    validateRequest(req,res);
    const user = new User({email, password});
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

/* POST Login user. */
const sanitizeLogin = [
  check('email')
  .isEmail()
  .withMessage("Geçersiz Email"),
  check('password')
  .notEmpty()
  .withMessage("Şifre boş olmamalı")
]
router.post('/login', sanitizeLogin, async (req, res, next) => {
  const { email, password } = req.body;
  try {
    validateRequest(req,res);
    const user = await User.findOne({email});
    if(!user) return res.status(403).json({error: 'User not found'});
    bcrypt.compare(password,user.password, (err, result) => {
      if(err) return res.status(500).json({error: err});
      if(result === false) return res.status(403).json({error: 'User not found'});
      const token = jwt.sign({id: user.id, email: user.email},process.env.JWT_SECRET,{ expiresIn: '2h' })
      return res.cookie('access_token',token, {
        expires: new Date(Date.now() + 2 * 3600000), // 2h
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true
      }).status(200).json({
        login: 'success',
        email: user.email
      });
      //204
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

/* GET logout. */
router.get('/logout', async (req, res, next) => {
  try {
    const access_token = req.signedCookies.access_token;
    const decodedUser = jwt.verify(access_token, process.env.JWT_SECRET);
    if(!decodedUser) return res.status(200).json({error: 'Something went wrong!'})
    res.clearCookie('access_token')
    return res.status(200).json({
      success: 'successfully loged out'
    });
  } catch (error) {
    //console.log(error);
    return res.status(403).json(error);
  }
});

/* GET if user authenticated. */
router.get('/me', async (req, res, next) => {
  try {
    const access_token = req.signedCookies.access_token;
    const decodedUser = jwt.verify(access_token, process.env.JWT_SECRET);
    res.status(200).json(decodedUser);
  } catch (error) {
    //console.log(error);
    return res.status(403).json(error);
  }
});

export default router;
