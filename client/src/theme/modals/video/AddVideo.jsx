import React, { Fragment, useEffect, useState } from 'react'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import FormHeader from '../../components/form/FormHeader'
import FormField from '../../components/form/FormField'
import Loader from '../../components/Loader'
import { Cloudinary } from '../../../services/Cloudinary'
import AxiosInstance from '../../../services/AxiosInstance'

const AddVideo = ({ setResponse, cancelHandler }) => {

    const initValues = { title: "", description: "", genre: "0", mediaType: "video", file: "" }
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
    
    const fileHandler = (e) => {
        const file = e.target.files[0]
        setFormErrors(validate({ ...formValues, file: file }))
        setFormValues({
            ...formValues,
            file: file
        })
    }

    const submissionHandler = (e) => {
        if (e) e.preventDefault()
        setIsSubmit(true)
        setFormErrors(validate(formValues))
    }

    const validate = (values) => {
        const errors = {}

        const allowedVideoExtensions = ["mp4", "mkv", "3gp", "mov", "avi", "webm", "flv", "wmv", "m4v"]
        const allowedImageExtensions = ["jpg", "jpeg", "png", "gif", "webp"]

        if (!values.title) errors.title = "Title is required"
        if (!values.description) errors.description = "Description is required"
        if (!values.genre || values.genre == "0" || values.genre == 0) errors.genre = "Genre must be selected"
        if (!values.file) errors.media = `${values.mediaType === "video" ? "Video" : "Image"} is required`
        else {
            const fileExtension = values.file.name.split(".").pop().toLowerCase()
            if (values.mediaType === "video" && !allowedVideoExtensions.includes(fileExtension)) {
                errors.media = "Allowed video formats: .mp4/.mkv/.mov/.avi/.webm/.flv/.wmv/.m4v/.3gp"
            } else if (values.mediaType === "image" && !allowedImageExtensions.includes(fileExtension)) {
                errors.media = "Allowed image formats: .jpg/.jpeg/.png/.gif/.webp"
            }
        }

        return errors
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) addMediaHandler()
        setIsSubmit(false)
    }, [formErrors])

    const addMediaHandler = async () => {
        setIsLoading(true)

        const folder = formValues.mediaType === "video" ? "/videos" : "/images"
        const mediaResp = await Cloudinary(formValues.file, folder)

        if (mediaResp.status === 500) {
            setIsLoading(false)
            return null
        }

        try {
            const resp = await AxiosInstance.post("/api/video/add", { 
                ...formValues, 
                url: mediaResp.data.url 
            })
            setResponse({ message: `${formValues.mediaType === "video" ? "Video" : "Image"} Added Successfully` })
            cancelHandler()
        } catch (err) {
            setResponse({ error: err })
        } finally {
            setIsLoading(false)
            setIsSubmit(false)
            setTimeout(() => setResponse({}), 3000)
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
            { isLoading && <Loader message={`Uploading your ${formValues.mediaType}...`} /> }
            <form>
                <FormHeader title={`Add a ${formValues.mediaType}`} />

                {/* Media Type Selector */}
                <FormField
                    name="mediaType"
                    id="mediaType"
                    label="Media Type"
                    fieldType="dropdown"
                    options={[
                        { text: "Video", value: "video" },
                        { text: "Image", value: "image" }
                    ]}
                    value={formValues.mediaType}
                    error={formErrors.mediaType}
                    handler={inputHandler}
                />

                <div className='w-full flex items-stretch justify-between gap-3'>
                    <FormField                 
                        name="title"
                        id="title"
                        label="Title"
                        placeholder="Title for your media..."
                        type="text"
                        fieldType="input"
                        value={formValues.title}
                        error={formErrors.title}
                        handler={inputHandler}
                    />
                    <FormField                 
                        name="genre"
                        id="genre"
                        label="Genre"
                        fieldType="dropdown"
                        options={genreOptions}
                        value={formValues.genre}
                        error={formErrors.genre}
                        handler={inputHandler}
                    />
                </div>            
                <FormField                 
                    name="description"
                    id="description"
                    label="Description"
                    placeholder="Description for your media..."
                    fieldType="textarea"
                    value={formValues.description}
                    error={formErrors.description}
                    handler={inputHandler}
                />
                <FormField                 
                    name="media"
                    id="media"
                    label={formValues.mediaType === "video" ? "Video" : "Image"}
                    fieldType="file"
                    value={formValues?.file?.name}
                    error={formErrors.media}
                    fileHandler={fileHandler}
                />
                <div className='flex items-center justify-end gap-3 mt-5'>
                    <PrimaryButton 
                        text="Cancel"
                        handler={cancelHandler}
                    />
                    <PrimaryButton 
                        text="Submit"
                        handler={submissionHandler}
                    />                
                </div>
            </form>
        </Fragment>
    )
}

export default AddVideo
