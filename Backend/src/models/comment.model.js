const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'comment text is required']
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: [true, 'post id is required for commenting']
    },
    user: {
        type: String, 
        required: [true, 'username is required for commenting']
    }
}, {
    timestamps: true
});

const commentModel = mongoose.model('comments', commentSchema);

module.exports = commentModel;
