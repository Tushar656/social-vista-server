const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

// UPDATE USER
router.put('/:id', async(req, res)=>{
    try{
        if(req.body.userId == req.params.id || req.body.isAdmin){
            if(req.body.password){
                try{
                    const salt = await bcrypt.genSalt(10)
                    req.body.password = await bcrypt.hash(req.body.password , salt)
                }catch(e){
                    res.status(500).send(e)
                }
            }
            try{
                const user = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                });
                res.status(200).send("Account has been updated")
            }catch(e){
                res.status(400).send(e)
            }
        }else{
            res.status(404).send('You can update only Your account')
        }
    }catch(e){
        res.status(400).send(e)
    }
})


// DELETE USER
router.delete('/:id', async(req, res)=>{
    if(req.body.userId == req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id)
            res.send('Account has been Deleted Successfully')
        }catch(e){
            res.send(e)
        }
    }else{
        res.status(403).send('You can delete only your Account')
    }
})


// GET AN USER
router.get('/userr/', async(req, res)=>{
    const userId = req.query.userId
    const username = req.query.username
    try{
        const user = userId
        ? await User.findById(userId)
        : await User.findOne({username : username})
        if(!user) return res.status(404).send('User Not found');
        const {password, updatedAt, ...other} = user._doc            // For not getting password and updateAt
        res.status(200).send(other)
    }catch(e){
        res.status(500).send(e)
    }
})

// SEARCH USERS
router.get('/search/', async(req, res)=>{
    const username = req.query.username
    try{
        const users = await User.find({ username: { $regex: username, $options: "i" } });
        if(!users) return res.status(404).send('No Users Found');
        res.status(200).send(users);
    }catch(err){
        res.status(500).send(err)
    }
})

// GET FRIENDS
router.get('/randomUsers', async (req, res) => {
    try {
      const totalUsersCount = await User.countDocuments();
  
      // If the database has less than 10 users, just return all users
      if (totalUsersCount <= 10) {
        const users = await User.find({}, '_id username ProfilePicture');
        return res.status(200).send(users);
      }
  
      // Use the aggregation pipeline to get 10 random users with specific fields
      const randomUsers = await User.aggregate([
        { $sample: { size: 10 } },
        {
          $project: {
            _id: 1,
            username: 1,
            ProfilePicture: 1,
          },
        },
      ]);
  
      res.status(200).send(randomUsers);
    } catch (e) {
      res.status(500).send(e);
    }
  });
  


// FOLLOW USER
router.put('/:id/follow', async(req, res)=>{
    if(req.body.userId != req.params.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({ $push: {followers: req.body.userId}})
                await currentUser.updateOne({ $push: {followeing: req.params.id}})
                res.send(`You followed ${user.username}`)
            }else{
                res.status(403).send('You already Follow this user')
            }

        }catch(e){
            res.send(e)
        }
    }else{
        res.send("You can't follow Your Self")
    }
})



// UNFOLLOW USER
router.put('/:id/unfollow', async(req, res)=>{
    if(req.body.userId != req.params.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull: {followers: req.body.userId}})
                await currentUser.updateOne({ $pull: {followeing: req.params.id}})
                res.send(`You unfollowed ${user.username}`)
            }else{
                res.status(403).send("You don't Follow this user")
            }

        }catch(e){
            res.send(e)
        }
    }else{
        res.send("You don't follow Your Self")
    }
})


// Get some Random Users
router.get('/randomUsers', async (req, res) => {
    try {
      const totalUsersCount = await User.countDocuments();
      const limit = Math.min(totalUsersCount, 10);
  
      if (totalUsersCount <= 10) {
        const users = await User.find();
        return res.status(200).send(users);
      }
  
      const randomUsers = await User.aggregate([
        { $sample: { size: limit } },
        {
          $project: {
            password: 0, // Exclude password field from the result
            updatedAt: 0, // Exclude updatedAt field from the result
          },
        },
      ]);
  
      res.status(200).send(randomUsers);
    } catch (e) {
      res.status(500).send(e);
    }
  });


module.exports = router