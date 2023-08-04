const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// REGISTER
router.post('/register', async (req, res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashPAss = await bcrypt.hash(req.body.password , salt)
        const newUser = new User(req.body)
        newUser.password = hashPAss
        const result = await newUser.save();

        // const authtoken = jwt.sign({id: newUser._id}, "thisissecreatekey");

        res.status(200).send(result);
    }catch(e){
        res.status(400).send("register error he : " + e)
    }
})

//LOGIN
router.post('/login', async(req, res)=>{
    try{
        const user = await User.findOne({email: req.body.email})
        if(!user) return res.status(400).send('User Not found');

        const matchPass = await bcrypt.compare(req.body.password , user.password)
        if(!matchPass) return res.status(400).send('Wrong Password')

        res.status(200).json(user)
    }catch(e){
        res.status(400).send("error ---" + e)
    }
})


module.exports = router