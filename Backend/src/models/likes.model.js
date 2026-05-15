const express = require('express');
const { default: mongoose } = require('mongoose');

const likeSchema = new mongoose.Schema({
    post: {
        // id comes from post collection
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: [true, 'post id is required for liking a post']
    },
    user: {
        type: String, 
        required: [true, 'username is required for liking a post']
    }
}, {
    timestamps: true
})

// creating unique index for liking 1 post only 1 time
likeSchema.index({ post: 1, user: 1 }, { unique: true} )

const likeModel = mongoose.model('likes', likeSchema);

module.exports = likeModel;