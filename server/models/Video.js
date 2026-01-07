const mongoose = require('mongoose')
const { Schema } = mongoose

const LikeSchema = new Schema({
    consumer: { type: Schema.Types.ObjectId, ref: 'user', required: true }
})

const CommentSchema = new Schema({
    comment: { type: String, required: true },
    consumer: { type: Schema.Types.ObjectId, ref: 'user', required: true }
}, { timestamps: true })

const PostSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },

    mediaType: { 
        type: String, 
        enum: ['video', 'image'], 
        required: true 
    },

    url: { type: String, required: true }, // video OR image URL

    likes: [LikeSchema],
    comments: [CommentSchema],
    views: { type: Number, default: 0 },

    creator: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    status: { type: Number, default: 1 }

}, { timestamps: true })

module.exports = mongoose.model('post', PostSchema)


// Status
// 1 - Public
// 2 - Private
// -1 - Deleted