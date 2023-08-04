const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minlength: 3, 
        unique: true
    }, 
    email: {
        type: String, 
        max: 50, 
        unique: true, 
        required : true
    },
    password: {
        type: String, 
        required: true, 
        unique: true, 
        min: 6
    }, 
    ProfilePicture: {
        type: String, 
        default: ""
    }, 
    CoverPicture: {
        type: String, 
        default: ""
    }, 
    followers: {
        type: Array, 
        default: []
    },
    followeing: {
        type: Array, 
        default: []
    }, 
    isAdmin: {
        type: Boolean, 
        default: false,
    }, 
    description: {
        type: String, 
        max: 50,
    },
    city: {
        type: String, 
        max: 50,
    }, 
    from: {
        type: String, 
        max: 50
    }, 
    relationShip: {
        type: String, 
        max: 50
    }
},
{timestamps : true}
)

module.exports = mongoose.model('smUser', userSchema);