import { Fragment, useContext, useEffect, useState } from 'react'
import { FaCloud } from 'react-icons/fa6'
import FormField from '../../../components/form/FormField'
import PrimaryButton from '../../../components/buttons/PrimaryButton'
import { Link, useNavigate } from 'react-router-dom'
import AxiosInstance from '../../../../services/AxiosInstance'
import { errorHandler } from '../../../../utils/helper'
import UserContext from '../../../../context/user/UserContext'

const Login = ({ setResponse, setIsLogin }) => {
    
    const initValues = { username: "", password: "" }
    const [ formValues, setFormValues ] = useState({ ...initValues })
    const [ formErrors, setFormErrors ] = useState({})
    const [ isSubmit, setIsSubmit ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const { setIsLoggedIn } = useContext(UserContext)
    const navigate = useNavigate()

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

        if (!values.username) errors.username = "Username cannot be blank"
        if (!values.password) errors.password = "Password cannot be blank"

        return errors
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) loginHandler()
        setIsSubmit(false)
    }, [ formErrors ])


    const loginHandler = async () => {
        setIsLoading(true)
        try {
            const resp = await AxiosInstance.post("/api/auth/login", formValues)
            if (resp.data.role == 2 || resp.data.role == 3) navigate("/reels-feed")
            setResponse({ message: "Login Success" })

        } catch (err) {
            setResponse({ error: errorHandler(err) })
        } finally {
            setIsLoading(false)
            setIsSubmit(false)
            setTimeout(() => {
                setResponse({})
            }, 3000)
        }
    }

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
                <div className='mt-5'>
                    <PrimaryButton
                        isLoading={ isLoading }
                        text={ `${ isLoading ? 'Logging in' : 'Login' }` }
                        handler={ !isLoading && submissionHandler }
                    />
                </div>
                <p className='text-sm self-start mt-3 text-secondary-500'>
                    Don't have an account?
                    <Link 
                        className={ "ml-1 text-primary-500" }
                        onClick={ () => setIsLogin(false) }
                    >
                        Signup
                    </Link>
                </p>
            </form>
        </Fragment>
    )
}

export default Login