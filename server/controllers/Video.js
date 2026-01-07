const express = require('express')
const getAuth = require('../middlewares/getAuth')
const Video = require('../models/Video')
const { body, validationResult } = require('express-validator')
const router = express.Router()

// Get all random. Using "/api/video/getAllRandom". Login required
router.get("/getAllRandom", getAuth, async (req, res) => {
    try {
        // If not a consumer
        if (req.user.role != 3) return res.status(401).json("Not authorized to access")

        // Find all videos and return
        const videos = await Video.aggregate([
            {
                $addFields: {
                    random: { $rand: {} }
                }
            },
            {
                $sort: { random: 1 }
            },
            {
                $lookup: {
                    from: 'users', // collection name (usually lowercase plural)
                    localField: 'creator',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            {   $unwind: '$creator' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'comments.consumer',
                    foreignField: '_id',
                    as: 'commentConsumers'
                }
            },
            {
                $addFields: {
                comments: {
                    $map: {
                    input: '$comments',
                    as: 'comment',
                    in: {
                        $mergeObjects: [
                        '$$comment',
                        {
                            consumer: {
                            $arrayElemAt: [
                                {
                                $filter: {
                                    input: '$commentConsumers',
                                    as: 'cc',
                                    cond: { $eq: ['$$cc._id', '$$comment.consumer'] }
                                }
                                },
                                0
                            ]
                            }
                        }
                        ]
                    }
                    }
                }
                }
            },
            {   $unset: 'commentConsumers' },
            {
                $project: {
                    title: 1,
                    description: 1,
                    url: 1,
                    genre: 1,
                    'creator.fullName': 1,
                    'creator.username': 1,
                    likes: 1,
                    comments: 1,
                    views: 1,
                    createdAt: 1
                }
            }
        ])

        // Returning response to the client
        return res.status(200).json(videos)

    } catch (err) {
        console.log(err)
        return res.status(500).json("Internal Server Error")
    }
})

// Get all by creator. Using "/api/video/getAllByCreator". Login required
router.get("/getAllByCreator", getAuth, async (req, res) => {
    try {
        // If not a creator
        if (req.user.role != 2) return res.status(401).json("Not authorized to access")
        
        // Destructuring id from request
        const { id } = req.user

        // Find all by creator
        const videos = await Video.find({ creator: id })
            .populate('creator', 'fullName username')
            .populate('comments.consumer', 'fullName username')
            .sort({ createdAt: -1 })

        // Returning response to the client
        return res.status(200).json(videos)

    } catch (err) {
        console.log(err)
        return res.status(500).json("Internal Server Error")
    }
})

// Get one by id. Using "/api/video/getOne/:id". Login required
router.get("/getOne/:id", getAuth, async (req, res) => {
    try {
        // If not a consumer
        if (req.user.role != 3) return res.status(401).json("Not authorized to access")
        
        // Destructuring id from request
        const { id } = req.params

        // Find by id
        const video = await Video.findById(id)
            .populate('creator', 'fullName username')
            .populate('comments.consumer', 'fullName username')
            .populate('likes.consumer', 'fullName username')

        // Returning response to the client
        return res.status(200).json(video)

    } catch (err) {
        console.log(err)
        return res.status(500).json("Internal Server Error")
    }
})

// Add video. Using "/api/video/add". Login required
// router.post("/add", 
//     getAuth, 
//     [
//         body('title', 'Title cannot be blank').exists(),
//         body('title', 'Title cannot be shorter than 5 characters').isLength({ min: 5 }),
//         body('description', 'Description cannot be blank').exists(),
//         body('description', 'Description cannot be shorter than 10 characters').isLength({ min: 10 }),
//         body('genre', 'Genre must be selected').exists(),
//         body('url', 'Url cannot be blank').exists(),
//     ],
//     async (req, res) => {
//         try {
//             // If not a creator
//             if (req.user.role != 2) return res.status(401).json("Not authorized to access")

//             // Find errors in request
//             const errors = validationResult(req)
//             if (!errors.isEmpty()) return res.status(400).json(errors.array())

//             // Destructuring the request
//             const { title, description, genre, url } = req.body
//             const { id } = req.user

//             // Add video
//             await Video.create({
//                 title: title,
//                 description: description,
//                 genre: genre,
//                 url: url,
//                 creator: id
//             })

//             // Returning response to the client
//             return res.status(200).json("Video uploaded successfully !!")

//         } catch (err) {
//             console.log(err)
//             return res.status(500).json("Internal Server Error")
//         }
//     }
// )
router.post("/add",
    getAuth,
    [
        body('title', 'Title cannot be blank').exists(),
        body('title', 'Title cannot be shorter than 5 characters').isLength({ min: 5 }),
        body('description', 'Description cannot be blank').exists(),
        body('description', 'Description cannot be shorter than 10 characters').isLength({ min: 10 }),
        body('type', 'Type must be video or image').isIn(['video', 'image']),
        body('url', 'Url cannot be blank').exists(),
    ],
    async (req, res) => {
        try {
            if (req.user.role != 2) return res.status(401).json("Not authorized to access")

            const errors = validationResult(req)
            if (!errors.isEmpty()) return res.status(400).json(errors.array())

            const { title, description, type, url, genre } = req.body
            const { id } = req.user

            await Media.create({
                title,
                description,
                type,
                url,
                genre: type === 'video' ? genre : undefined, // genre only for videos
                creator: id
            })

            return res.status(200).json(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully !!`)
        } catch (err) {
            console.log(err)
            return res.status(500).json("Internal Server Error")
        }
    }
)
// Like video. Using "/api/video/like/:id". Login required
router.put("/like/:id", getAuth, async (req, res) => {
    try {
        // If not a consumer
        if (req.user.role != 3) return res.status(401).json("Not authorized to access")

        // Destructuring the request
        const { id } = req.params

        // Find video by id
        const video = await Video.findById(id)

        // If video not found
        if (!video) return res.status(404).json("Video not found")

        // Prepare like object and push
        const like = { consumer: req.user.id }
        video.likes.push(like)

        await video.save()

        // Returning response to the client
        return res.status(200).json("Video liked successfully !!")     

    } catch (err) {
        console.log(err)
        return res.status(500).json("Internal Server Error")
    }
})

// Unlike video. Using "/api/video/unlike/:id". Login required
router.put("/unlike/:id", getAuth, async (req, res) => {
    try {
        // If not a consumer
        if (req.user.role != 3) return res.status(401).json("Not authorized to access")

        // Destructuring the request
        const { id } = req.params

        // Find video by id
        const video = await Video.findById(id)

        // If video not found
        if (!video) return res.status(404).json("Video not found")

        // Filter out the like and save
        video.likes = video.likes.filter(
            like => like.consumer.toString() !== req.user.id
        )

        await video.save()

        // Returning response to the client
        return res.status(200).json("Video unliked successfully !!")

    } catch (err) {
        console.log(err)
        return res.status(500).json("Internal Server Error")
    }
})

// Comment video. Using "/api/video/comment/:id". Login required
router.put("/comment/:id", 
    getAuth,
    [
        body('comment', 'Comment cannot be blank').exists(),
        body('comment', 'Comment cannot be shorter than 4').isLength({ min: 4 }),
    ],
    async (req, res) => {
        try {
            // If not a consumer
            if (req.user.role != 3) return res.status(401).json("Not authorized to access")
            
            // Destructuring the request
            const { comment } = req.body
            const { id } = req.params

            // Find video by id
            const video = await Video.findById(id)

            // If video not found
            if (!video) return res.status(404).json("Video not found")

            // Prepare comment object and push
            const commentObj = { 
                comment: comment,
                consumer: req.user.id 
            }
            video.comments.push(commentObj)

            await video.save()

            // Returning response to the client
            return res.status(200).json("Comment added successfully !!")

        } catch (err) {
            console.log(err)
            return res.status(500).json("Internal Server Error")
        }
    }
)

// Add view. Using "/api/video/view/:id". Login required
router.put("/view/:id", getAuth, async (req, res) => {
    try {
        // If not a consumer
        if (req.user.role != 3) return res.status(401).json("Not authorized to access")

        // Destructuring the request
        const { id } = req.params

        // Find video by id
        const video = await Video.findById(id)

        // If video not found
        if (!video) return res.status(404).json("Video not found")

        // Add a view and push
        video.views += 1

        await video.save()

        // Returning response to the client
        return res.status(200).json("Video viewed successfully !!")

    } catch (err) {
        console.log(err)
        return res.status(500).json("Internal Server Error")
    }
})

module.exports = router