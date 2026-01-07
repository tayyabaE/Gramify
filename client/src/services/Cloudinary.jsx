import axios from "axios"
import AxiosInstance from "./AxiosInstance"
import { errorHandler } from "../utils/helper"

const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_NAME

export const Cloudinary = async (file, folderName) => {
    try {
        // 1️⃣ Get signature
        const signResp = await AxiosInstance.post('/api/cloudinary/genSignature', {
            folderName
        })

        const { signature, timestamp, apiKey } = signResp.data

        // 2️⃣ Prepare form data
        const formData = new FormData()
        formData.append("file", file)
        formData.append("api_key", apiKey)
        formData.append("timestamp", timestamp)
        formData.append("signature", signature)
        formData.append("folder", `cloudplay/${folderName}`)

        // 3️⃣ AUTO upload (IMPORTANT)
       

        const resp = await axios.post(
    `https://api.cloudinary.com/v1_1/${CloudinaryCloudName}/auto/upload`,
    formData
)

        return {
            status: resp.status,
            data: {
                url: resp.data.secure_url,
                publicId: resp.data.public_id,
                resourceType: resp.data.resource_type
            }
        }

    } catch (err) {
        console.error("Cloudinary upload failed:", errorHandler(err))
        return { status: 500 }
    }
}
