const mongoose = require('mongoose')
const { Schema } = mongoose

const LikeSchema = new Schema({
    consumer: { type: Schema.Types.ObjectId, ref: 'user', required: true }
})

const CommentSchema = new Schema({
    comment: { type: String, required: true },
    consumer: { type: Schema.Types.ObjectId, ref: 'user', required: true }
}, { timestamps: true })

const MediaSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String }, // optional for images if you want
    type: { type: String, enum: ['video', 'image'], required: true }, // NEW
    likes: [LikeSchema],
    comments: [CommentSchema],
    views: { type: Number, default: 0 },
    creator: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    url: { type: String, required: true },
    status: { type: Number, default: 1 } // 1-public, 2-private, -1-deleted
}, { timestamps: true })

const Media = mongoose.model('media', MediaSchema)
module.exports = Media
