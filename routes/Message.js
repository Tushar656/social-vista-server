const router = require('express').Router()
const Message = require('../models/Messages')
const Conversation = require('../models/Conversations')

// ADD
router.post('/', async(req, res)=>{
    const newmessage = new Message(req.body)

    try{
        const savedMessage = await newmessage.save();
        res.status(200).json(savedMessage);
    }catch(err){
        res.status(500).json("Add msg error")
    }
})

// GET
router.get('/:conversationId', async(req, res)=>{
    try{
        const messages = await Message.find({
            ConversationID: req.params.conversationId
        });
        res.status(200).send(messages);
    }catch(err){
        res.status(500).json("Get msg error")
    }
})

// GET COUNT OF UNSEEN MESSAGES
router.get('/count/:conversationId', async(req, res) => {
    try{
        const messages = await Message.find({
            ConversationID: req.params.conversationId
        });
        const numberOfUnseenMessages = messages.filter(message => !message.seenStatus).length;
        res.status(200).json(numberOfUnseenMessages);
    }catch(err){
        res.status(500).json("Count messages error")
    }
})

// GET COUNT FOR ALL CONVERSATION
router.get('/all/count/:userId', async (req, res) => {
    try {
      const conversations = await Conversation.find({
        members: { $in: [req.params.userId] }
      });
  
      const messageCountPromises = conversations.map(async (conversation) => {
        const conversationId = conversation._id; // Extract the conversationId from the conversation object
        const messages = await Message.find({
            ConversationID: conversationId,
            sender: {$ne: req.params.userId}
        });
        const messageCount = messages.filter(message => !message.seenStatus).length;
        return { conversationId, messageCount };
      });
  
      const conversationMessageCounts = await Promise.all(messageCountPromises);
      res.json(conversationMessageCounts);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

// MARK ALL AS READ
router.put('/read/:conversationId', async(req, res) => {
    try{
        const messages = await Message.find({
            ConversationID: req.params.conversationId
        })
        messages.forEach(message => {
            message.seenStatus = true;
            message.save();
        })
        res.status(200).json(messages); 
    }catch(err){
        res.status(500).json("Read messages error")
    }
})


module.exports = router