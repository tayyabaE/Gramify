import { Fragment, useEffect, useState } from 'react'
import { FaCloud } from 'react-icons/fa6'
import FormField from '../../../components/form/FormField'
import PrimaryButton from '../../../components/buttons/PrimaryButton'
import { Link, useNavigate } from 'react-router-dom'
import AxiosInstance from '../../../../services/AxiosInstance'
import { errorHandler } from '../../../../utils/helper'

const Signup = ({ setResponse, setIsLogin }) => {
    
    const navigate = useNavigate()
    const initValues = { fullName: "", email: "", username: "", password: "", confirmPassword: "", role: 0 }
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

    const submissionHandler = (e) => {
        if (e) e.preventDefault()
        setFormErrors(validate(formValues))
        setIsSubmit(true)
    }

    const validate = (values) => {
        const errors = {}
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        
        if (!values.fullName) errors.fullName = "Name cannot be blank"
        if (!values.email) errors.email = "Email cannot be blank"
        else if (!emailRegex.test(values.email)) errors.email = "Email should be a valid email"
        if (!values.username) errors.username = "Username cannot be blank"
        if (!values.password) errors.password = "Password cannot be blank"
        if (!values.confirmPassword) errors.confirmPassword = "Confirm password cannot be blank"
        else if (values.password && values.password != values.confirmPassword) errors.confirmPassword = "Confirm password doesn't match"
        if (!values.role || values.role == "0" || values.role == 0) errors.role = "Role must be selected"
        else if (values.role != 2 && values.role != 3) errors.role = "Role must be valid"

        return errors
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) signupHandler()
        setIsSubmit(false)
    }, [ formErrors ])


    const signupHandler = async () => {
        setIsLoading(true)
        try {
            const resp = await AxiosInstance.post("/api/auth/register", formValues)
            setResponse({ message: "Signup Successfully" })
            setFormValues({ ...initValues })
            setIsLogin(true)
        } catch (err) {
            setResponse({ error: errorHandler(err) })
        } finally {
            setIsSubmit(false)
            setIsLoading(false)
            setTimeout(() => {
                setResponse({})
            }, 3000)
        }
    }

    const roleOptions = [
        { text: "Creator", value: 2 },
        { text: "Consumer", value: 3 }
    ]

    return (
        <Fragment>

            <Link
                to={ "" }
                className="w-max flex items-center justify-start gap-3 text-2xl text-primary-500 font-bold mx-auto mb-4"
            >
                <FaCloud />
                gramify
            </Link>
            <form className='flex flex-col items-end justify-end'>
                <div className='w-full flex flex-col sm:flex-row items-stretch justify-between sm:gap-3'>
                    <FormField
                        fieldType={ "input" }
                        type={ "text" }
                        label={ "Full Name" }
                        id={ "fullName" }
                        name={ "fullName" }
                        value={ formValues.fullName }
                        handler={ inputHandler }
                        error={ formErrors.fullName }
                    />
                    <FormField
                        fieldType={ "input" }
                        type={ "text" }
                        label={ "Email Address" }
                        id={ "email" }
                        name={ "email" }
                        value={ formValues.email }
                        handler={ inputHandler }
                        error={ formErrors.email }
                    />
                </div>
                <FormField
                    fieldType={ "input" }
                    type={ "text" }
                    label={ "Username" }
                    id={ "username" }
                    name={ "username" }
                    value={ formValues.username }
                    handler={ inputHandler }
                    error={ formErrors.username }
                />                
                <div className='w-full flex flex-col sm:flex-row items-stretch justify-between sm:gap-3'>
                    <FormField
                        fieldType={ "input" }
                        type={ "password" }
                        label={ "Password" }
                        id={ "password" }
                        name={ "password" }
                        value={ formValues.password }
                        handler={ inputHandler }
                        error={ formErrors.password }
                    />
                    <FormField
                        fieldType={ "input" }
                        type={ "password" }
                        label={ "Confirm Password" }
                        id={ "confirmPassword" }
                        name={ "confirmPassword" }
                        value={ formValues.confirmPassword }
                        handler={ inputHandler }
                        error={ formErrors.confirmPassword }
                    />
                </div>
                <FormField                 
                    name={ "role" }
                    id={ "role" }
                    label={ "Role" }
                    fieldType={ "dropdown" }
                    options={ roleOptions }
                    value={ formValues.role }
                    error={ formErrors.role }
                    handler={ inputHandler }
                />
                <div className='mt-5'>
                    <PrimaryButton
                        isLoading={ isLoading }
                        text={ `${ isLoading ? 'Signing up' : 'Sign Up' }` }
                        handler={ !isLoading && submissionHandler }
                    />
                </div>
                <p className='text-sm self-start mt-3 text-secondary-500'>
                    Already have an account?
                    <Link 
                        className={ "ml-1 text-primary-500" }
                        onClick={ () => setIsLogin(true) }
                    >
                        Login
                    </Link>
                </p>
            </form>
        </Fragment>
    )
}

export default Signup