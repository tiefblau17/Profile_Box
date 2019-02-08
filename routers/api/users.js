const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');


//validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const Users = require('../../models/Users');

// @route   GET api/users/test
// @desc    Test users route
// @access  Public
router.get('/test', (req, res) => res.json({msg: "Users works"}));

// @route   POST api/users/register
// @desc    Register the user
// @access  Public
router.post('/register', (req, res) => {

    const{errors, isValid} = validateRegisterInput(req.body);

    // check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    Users.findOne({email: req.body.email})
        .then(user => {
            if(user){
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
            }else{

                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                })

                const newUser = new Users({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar,
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })
            }
        })
})

// @route   GET api/users/login
// @desc    Login the user / Returning JWT Token
// @access  Public
router.post('/login', (req,res) => {

    const{errors, isValid} = validateLoginInput(req.body);

    // check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    Users.findOne({email})
        .then(user => {
            if(!user){
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        const payload = {id: user.id, name: user.name, avatar: user.avatar}

                        jwt.sign(payload, keys.secrectOrKey, {expiresIn: 7200}, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        });
                    }
                    else{
                        errors.password = 'Incorrect Password';
                        return res.status(400).json(errors);
                    }
                });
        });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req,res) => {
    res.json(req.user);
})

module.exports = router;