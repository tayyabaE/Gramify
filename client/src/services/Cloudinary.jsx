import axios from "axios"
import AxiosInstance from "./AxiosInstance"

export const Cloudinary = async (
  file,
  folderName,
  mediaType,
  onProgress 
) => {
  const resourceType = mediaType === "image" ? "image" : "video"

  let params = {}
  try {
    const signResp = await AxiosInstance.post(
      "/api/cloudinary/genSignature",
      { folderName }
    )
    const { signature, timestamp, apiKey } = signResp.data
    params = { signature, timestamp, apiKey }
  } catch (err) {
    console.error("Signature error", err)
    return { status: 500 }
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("api_key", params.apiKey)
  formData.append("timestamp", params.timestamp)
  formData.append("signature", params.signature)
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
  formData.append("folder", `cloudplay/${folderName}`)

  try {
    const resp = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/${resourceType}/upload`,
      formData,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,

        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return

          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )

          if (onProgress) onProgress(percent)
        },
      }
    )

    return {
      status: resp.status,
      data: {
        url: resp.data.secure_url,
        publicId: resp.data.public_id,
        mediaType,
      },
    }
  } catch (err) {
    console.error("Cloudinary upload failed:", err)
    return { status: 500 }
  }
}


// import axios from "axios"
// import AxiosInstance from "./AxiosInstance"
// import { errorHandler } from "../utils/helper"

// const CloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
// const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_NAME

// export const Cloudinary = async (file, folderName, mediaType) => {
//     const resourceType = mediaType === 'image' ? 'image' : 'video'

//     // Get signature from backend
//     let params = {}
//     try {
//         const signResp = await AxiosInstance.post('/api/cloudinary/genSignature', { folderName })
//         const { signature, timestamp, apiKey } = signResp.data
//         params = { signature, timestamp, apiKey }
//     } catch (err) {
//         console.error("Error generating Cloudinary signature", err)
//         return { status: 500 }
//     }

//     // Upload to Cloudinary
//     const formData = new FormData()
//     formData.append('file', file)
//     formData.append('api_key', params.apiKey)
//     formData.append('timestamp', params.timestamp)
//     formData.append('signature', params.signature)
//     formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
//     formData.append('folder', `cloudplay/${folderName}`)

//     try {
//         const resp = await axios.post(
//   `https://api.cloudinary.com/v1_1/${CloudinaryCloudName}/${resourceType}/upload`,
//   formData,
//   {
//     headers: {
//       'X-Requested-With': 'XMLHttpRequest'
//     },
//     maxBodyLength: Infinity,
//     maxContentLength: Infinity
//   }
// )

//         // const resp = await axios.post(
//         //     `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/${resourceType}/upload`,
//         //     formData
//         // )
//         return {
//             status: resp.status,
//             data: {
//                 url: resp.data.secure_url,
//                 publicId: resp.data.public_id,
//                 mediaType
//             }
//         }
//     } catch (err) {
//         console.error("Cloudinary upload failed:", err)
//         return { status: 500 }
//     }
// }

