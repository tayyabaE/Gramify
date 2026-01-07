const express = require('express')
const router = express.Router()
const cloudinary = require("cloudinary").v2

// Generate signature for upload
router.post('/genSignature', (req, res) => {
    try {
        const timestamp = Math.round((new Date()).getTime() / 1000)
        const { folderName } = req.body
        
        const params_to_sign = {
            timestamp: timestamp,
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
            folder: `cloudplay/${ folderName }`
        }
    
        const signature = cloudinary.utils.api_sign_request(params_to_sign, process.env.CLOUDINARY_APISECRET)
        
        return res.status(200).json({
            signature: signature,
            timestamp: timestamp,
            cloudName: process.env.CLOUDINARY_NAME,
            apiKey: process.env.CLOUDINARY_APIKEY
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json("Internal Server Error")
    }
})

module.exports = router