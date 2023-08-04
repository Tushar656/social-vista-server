const router = require('express').Router()
const Conversation = require('../models/Conversations')


// NEW CONVERSATION
router.post('/', async(req, res)=>{
    const newConversation = new Conversation({
        members: [req.body.SenderId, req.body.reciverId]
    })
    try{
        const saveConversation = await newConversation.save();
        res.status(200).json(saveConversation);
    }catch(err){
        res.status(500).json("New conversation Err")
    }
})


// GET CONVERSATION OF AN USER
router.get('/:userId', async(req, res)=>{
    try{
        const conversation = await Conversation.find({
            members: {$in: [req.params.userId]}
        })
        res.status(200).json(conversation);
    }catch(err){
        res.status(500).json("Get conversation Err")
    }
})

// GET CONVERSATION OF TWO USERS
router.get('/find/:firstUserid/:secondUserid', async(req, res)=>{
    try{
        const conversation = await Conversation.findOne({
            members: { $all : [req.params.firstUserid, req.params.secondUserid]}
        })
        console.log(conversation);
        res.json(conversation)
    }catch(err){
        res.status(403).json("Get conv err")
    }
})


module.exports = router