const mongoose = require('mongoose')
const { Schema } = mongoose

const LikeSchema = new Schema({
    consumer: { type: Schema.Types.ObjectId, ref: 'user', required: true }
})

const CommentSchema = new Schema({
    comment: { type: String, required: true },
    consumer: { type: Schema.Types.ObjectId, ref: 'user', required: true }
}, { timestamps: true })

const VideoSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    likes: [ LikeSchema ],
    comments: [ CommentSchema ],
    views: { type: Number, default: 0 },
    creator: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    url: { type: String, required: true },
    status: { type: Number, default: 1 }
}, { timestamps: true })

const Video = mongoose.model('video', VideoSchema)
module.exports = Video

// Status
// 1 - Public
// 2 - Private
// -1 - Deleted