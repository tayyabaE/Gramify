import React, { Fragment, useEffect, useState } from 'react'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import FormHeader from '../../components/form/FormHeader'
import FormField from '../../components/form/FormField'
import Loader from '../../components/Loader'
import { Cloudinary } from '../../../services/Cloudinary'
import AxiosInstance from '../../../services/AxiosInstance'

const AddVideo = ({ setResponse, cancelHandler }) => {

    const initValues = { 
    title: "", 
    description: "", 
    genre: "0", 
    file: null,
    mediaType: "" // "image" | "video"
}

    const [ formValues, setFormValues ] = useState({ ...initValues })
    const [ formErrors, setFormErrors ] = useState({})
    const [ isSubmit, setIsSubmit ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    
    const inputHandler = (e) => {
        const { name, value } = e.target
        setFormErrors(validate({ ...formValues, [name]: value }))
        setFormValues({
            ...formValues,
            [name]: value
        })
    }
    
   const mediaFileHandler = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const type = file.type.startsWith("image") ? "image" : "video"

    setFormErrors(validate({ ...formValues, file, mediaType: type }))
    setFormValues({
        ...formValues,
        file,
        mediaType: type
    })
}


    const submissionHandler = (e) => {
        if (e) e.preventDefault()
        setIsSubmit(true)
        setFormErrors(validate(formValues))
    }

    const validate = (values) => {
    const errors = {}

    const videoExt = ["mp4","mkv","3gp","mov","avi","webm","flv","wmv","m4v"]
    const imageExt = ["jpg","jpeg","png","webp","gif"]

    if (!values.title) errors.title = "Title is required"
    if (!values.description) errors.description = "Description is required"
    if (!values.genre || values.genre === "0") errors.genre = "Genre must be selected"

    if (!values.file) {
        errors.video = "Media file is required"
    } else {
        const ext = values.file.name.split(".").pop().toLowerCase()

        if (values.mediaType === "video" && !videoExt.includes(ext)) {
            errors.video = "Invalid video format"
        }

        if (values.mediaType === "image" && !imageExt.includes(ext)) {
            errors.video = "Invalid image format"
        }
    }

    return errors
}


    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) addVideoHandler()
        setIsSubmit(false)
    }, [formErrors])

    const addVideoHandler = async (e) => {
        setIsLoading(true)

       const mediaResp = await Cloudinary(
    formValues.file,
    formValues.mediaType === "image" ? "/images" : "/videos",
    formValues.mediaType
)


        if (videoResp.status === 500) {
            setIsLoading(false)
            return null
        }

        try {
            const resp = await AxiosInstance.post("/api/video/add", {
    title: formValues.title,
    description: formValues.description,
    genre: formValues.genre,
    mediaUrl: mediaResp.data.url,
    mediaPublicId: mediaResp.data.publicId,
    mediaType: formValues.mediaType
})
            setResponse({ message: "Video Added Successfully" })
            cancelHandler()
        } catch (err) {
            setResponse({ error: err })
        } finally {
            setIsLoading(false)
            setIsSubmit(false)
            setTimeout(() => {
                setResponse({})
            }, 3000)
        }
    }

    const genreOptions = [
        { text: "Entertainment", value: "Entertainment" },
        { text: "Informational/Educational", value: "Informational/Educational" },
        { text: "Lifestyle & Vlogs", value: "Lifestyle & Vlogs" },
        { text: "Technology & Business", value: "Technology & Business" },
        { text: "Arts & Creativity", value: "Arts & Creativity" },
        { text: "Gaming", value: "Gaming" },
        { text: "News & Commentary", value: "News & Commentary" },
        { text: "Motivational / Spiritual", value: "Motivational / Spiritual" },
    ]
    

    return (
        <Fragment>
            { isLoading && <Loader message={ "Uploading your video...." } /> }
            <form>
                <FormHeader title={ "Add a Video" } />
                <div className='w-full flex items-stretch justify-between gap-3'>
                    <FormField                 
                        name={ "title" }
                        id={ "title" }
                        label={ "Title" }
                        placeholder={ "Title for a video.." }
                        type={ "text" }
                        fieldType={ "input" }
                        value={ formValues.title }
                        error={ formErrors.title }
                        handler={ inputHandler }
                    />
                    <FormField                 
                        name={ "genre" }
                        id={ "genre" }
                        label={ "Genre" }
                        fieldType={ "dropdown" }
                        options={ genreOptions }
                        value={ formValues.genre }
                        error={ formErrors.genre }
                        handler={ inputHandler }
                    />
                </div>            
                <FormField                 
                    name={ "description" }
                    id={ "description" }
                    label={ "Description" }
                    placeholder={ "Description for a video.." }
                    fieldType={ "textarea" }
                    value={ formValues.description }
                    error={ formErrors.description }
                    handler={ inputHandler }
                />
                <FormField                 
    name="media"
    id="media"
    label="Video / Image"
    fieldType="file"
    value={formValues?.file?.name}
    error={formErrors.video}
    fileHandler={mediaFileHandler}
/>

                <div className='flex items-center justify-end gap-3 mt-5'>
                    <PrimaryButton 
                        text={ "Cancel" }
                        handler={ cancelHandler }
                    />
                    <PrimaryButton 
                        text={ "Submit" }
                        handler={ submissionHandler }
                    />                
                </div>
            </form>
        </Fragment>
    )
}

export default AddVideo