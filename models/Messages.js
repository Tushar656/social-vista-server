const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        ConversationID: {
            type: String
        },
        sender: {
            type: String
        },
        text :{
            type: String
        },
        seenStatus: {
            type: Boolean,
            default: false,
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model('Message', MessageSchema);