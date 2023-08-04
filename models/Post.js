const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    userId: {
        type: String, 
        require: true
    }, 
    disc: {
        type: String, 
        max: 100, 
        require: true
    }, 
    image: {
        type: String,
        default: ""
    }, 
    likes: {
        type: Array, 
        default: []
    }
},{timestamps: true}
)

module.exports = mongoose.model("Post", PostSchema)