import { useState } from 'react'
import Background from '/images/bg-image.jpg'
import Alert from '../theme/components/Alert'
import Login from '../theme/sections/client/auth/Login'
import Signup from '../theme/sections/client/auth/Signup'

const Auth = () => {

    const [ response, setResponse ] = useState({})
    const [ isLogin, setIsLogin ] = useState(true)

    return (
        <section 
            className='flex flex-col items-center justify-center h-dvh px-5 sm:px-10 md:px-15 lg:px-25 xl:px-50 py-5 md:py-10 bg-primary-100 bg-cover bg-no-repeat'
            style={{ backgroundImage: `url( ${ Background } )` }}
        >
            <Alert response={ response } />
            <div className="p-5 border bg-primary-100 border-primary-500/20 rounded-xl drop-shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                { 
                    isLogin ? 
                    <Login setResponse={ setResponse } setIsLogin={ setIsLogin } /> : 
                    <Signup setResponse={ setResponse } setIsLogin={ setIsLogin } /> 
                }
            </div>
        </section>
    )
}

export default Auth