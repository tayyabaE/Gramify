import axios from "axios"
import AxiosInstance from "./AxiosInstance"
import { errorHandler } from "../utils/helper"

const CloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_NAME

export const Cloudinary = async (video, folderName) => {
    const params = {}

    // Get signature from your backend
    try {
        const signResp = await AxiosInstance.post('/api/cloudinary/genSignature', {
            folderName: folderName
        })
        const { signature, timestamp, apiKey } = signResp.data
        params.signature = signature
        params.timestamp = timestamp
        params.apiKey = apiKey
    } catch (err) {
        console.log(err)
        return { status: 500 }
    }

    // Params for Signed Upload
    const formData = new FormData()
    formData.append('file', video)
    formData.append('api_key', params.apiKey)
    formData.append('timestamp', params.timestamp)
    formData.append('signature', params.signature)
    formData.append('upload_preset', CloudinaryUploadPreset)
    formData.append('folder', `cloudplay/${ folderName }`)

    try {
        const resp = await axios.post(
            `https://api.cloudinary.com/v1_1/${ CloudinaryCloudName }/video/upload`,
            formData
        )
        
        return {
            status: resp.status,
            data: {
                url: resp.data.secure_url,
                publicId: resp.data.public_id
            }
        }
    } catch (err) {
        // Cloudinary gives clear JSON errors — let’s show them properly
        console.error("Cloudinary upload failed:", errorHandler(err))
        return {
            status: 500
        }
    }
}