import React, { Fragment, useEffect, useState } from 'react'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import FormHeader from '../../components/form/FormHeader'
import FormField from '../../components/form/FormField'
import Loader from '../../components/Loader'
import { Cloudinary } from '../../../services/Cloudinary'
import AxiosInstance from '../../../services/AxiosInstance'

const AddVideo = ({ setResponse, cancelHandler }) => {
    const initValues = { title: "", description: "", genre: "0", type: "video", file: "" }
    const [formValues, setFormValues] = useState({ ...initValues })
    const [formErrors, setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

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

        const videoExtensions = ["mp4", "mkv", "3gp", "mov", "avi", "webm", "flv", "wmv", "m4v"]
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp"]

        if (!values.title) errors.title = "Title is required"
        if (!values.description) errors.description = "Description is required"
        if (!values.type) errors.type = "Please select type"
        if (!values.file) errors.file = `${values.type === "video" ? "Video" : "Image"} is required`
        else {
            const fileExtension = values.file.name.split(".").pop().toLowerCase()
            if (values.type === "video" && !videoExtensions.includes(fileExtension))
                errors.file = "Allowed video formats: " + videoExtensions.join("/")
            if (values.type === "image" && !imageExtensions.includes(fileExtension))
                errors.file = "Allowed image formats: " + imageExtensions.join("/")
        }

        if (values.type === "video") {
            if (!values.genre || values.genre === "0") errors.genre = "Genre must be selected for video"
        }

        return errors
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) addMediaHandler()
        setIsSubmit(false)
    }, [formErrors])

    const addMediaHandler = async () => {
        setIsLoading(true)

        const folder = formValues.type === "video" ? "/videos" : "/images"
        const mediaResp = await Cloudinary(formValues.file, folder)

        if (mediaResp.status === 500) {
            setIsLoading(false)
            return null
        }

        try {
            const payload = {
                title: formValues.title,
                description: formValues.description,
                type: formValues.type,
                url: mediaResp.data.url,
                genre: formValues.type === "video" ? formValues.genre : undefined
            }

            
            const resp = await AxiosInstance.post("/api/video/add", payload)
            setResponse({ message: `${formValues.type.charAt(0).toUpperCase() + formValues.type.slice(1)} Added Successfully` })
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

    const typeOptions = [
        { text: "Video", value: "video" },
        { text: "Image", value: "image" }
    ]

    return (
        <Fragment>
            {isLoading && <Loader message={`Uploading your ${formValues.type}...`} />}
            <form>
                <FormHeader title={`Add a ${formValues.type.charAt(0).toUpperCase() + formValues.type.slice(1)}`} />

                <div className="w-full flex items-stretch justify-between gap-3">
                    <FormField
                        name="title"
                        id="title"
                        label="Title"
                        placeholder={`Title for a ${formValues.type}..`}
                        type="text"
                        fieldType="input"
                        value={formValues.title}
                        error={formErrors.title}
                        handler={inputHandler}
                    />
                    <FormField
                        name="type"
                        id="type"
                        label="Type"
                        fieldType="dropdown"
                        options={typeOptions}
                        value={formValues.type}
                        error={formErrors.type}
                        handler={inputHandler}
                    />
                </div>

                {formValues.type === "video" && (
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
                )}

                <FormField
                    name="description"
                    id="description"
                    label="Description"
                    placeholder={`Description for a ${formValues.type}..`}
                    fieldType="textarea"
                    value={formValues.description}
                    error={formErrors.description}
                    handler={inputHandler}
                />

                <FormField
                    name="file"
                    id="file"
                    label={formValues.type === "video" ? "Video" : "Image"}
                    fieldType="file"
                    value={formValues?.file?.name}
                    error={formErrors.file}
                    fileHandler={fileHandler}
                />

                <div className="flex items-center justify-end gap-3 mt-5">
                    <PrimaryButton text="Cancel" handler={cancelHandler} />
                    <PrimaryButton text="Submit" handler={submissionHandler} />
                </div>
            </form>
        </Fragment>
    )
}

export default AddVideo
