import { useContext, useEffect, useState } from 'react'
import ShortsContainer from '../../theme/components/video/ShortsContainer'
import Background from '/images/bg-image.jpg'
import PrimaryButton from '../../theme/components/buttons/PrimaryButton'
import Modal from '../../theme/components/Modal'
import AddVideo from '../../theme/modals/video/AddVideo'
import Alert from '../../theme/components/Alert'
import UserContext from '../../context/user/UserContext'
import { FaArrowRightFromBracket } from 'react-icons/fa6'
import Loader from '../../theme/components/Loader'
import AxiosInstance from '../../services/AxiosInstance'
import { useNavigate } from 'react-router-dom'
import { errorHandler } from '../../utils/helper'

const ReelsFeed = () => {
    
    const navigate = useNavigate()
    const [ child, setChild ] = useState(null)
    const [ response, setResponse ] = useState({})
    const [ videos, setVideos ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(false)
    const { user, setUser, setIsLoggedIn } = useContext(UserContext)

    const [userInteracted, setUserInteracted] = useState(false)

    useEffect(() => {
        const handleInteraction = () => {
            setUserInteracted(true)
            window.removeEventListener('click', handleInteraction)
            window.removeEventListener('touchstart', handleInteraction)
        }

        window.addEventListener('click', handleInteraction)
        window.addEventListener('touchstart', handleInteraction)

        return () => {
            window.removeEventListener('click', handleInteraction)
            window.removeEventListener('touchstart', handleInteraction)
        }
    }, [])

    const getAddVideoModal = (e) => {
        if (e) e.preventDefault()
        setChild(<AddVideo setResponse={ setResponse } cancelHandler={ cancelHandler } />)
    }

    const cancelHandler = (e) => {
        if (e) e.preventDefault()
        setChild(null)
    }

    const logoutHandler = async (e) => {
        setIsLoading(true)
        try {
            const resp = await AxiosInstance.post("/api/auth/logout")
            setResponse({ message: "Logout Success" })
            setUser(null)
            setIsLoggedIn(false)
            navigate('/')

        } catch (err) {
            setResponse({ error: errorHandler(err) })
        } finally {
            setIsLoading(false)
            setTimeout(() => {
                setResponse({})
            }, 3000)
        }
    }

    const getAllRandom = async (e) => {
        setIsLoading(true)
        try {
            const resp = await AxiosInstance.get("/api/video/getAllRandom")
            setVideos(resp.data)
        } catch (err) {
            console.log(errorHandler(err))
        } finally {
            setIsLoading(false)
        }
    }

    const getAllByCreator = async (e) => {
        setIsLoading(true)
        try {
            const resp = await AxiosInstance.get("/api/video/getAllByCreator")
            setVideos(resp.data)
        } catch (err) {
            console.log(errorHandler(err))
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user.role === 2) getAllByCreator()
        else if (user.role === 3) getAllRandom()
    }, [ response.message ])

    return (
        <section 
            className='w-full h-dvh flex items-start justify-between bg-white bg-cover'
            // style={{ background: `url(${ Background })`}}
        >
            { isLoading && <Loader message={ videos ? "Logging you out ..." : "Loading videos for you ..." } /> }
            {/* For Creators Only */}
            <div className='z-50 flex items-stretch justify-start gap-2.5 fixed p-5'>
                <PrimaryButton
                    icon={ <FaArrowRightFromBracket /> }
                    handler={ logoutHandler }
                />
                {
                    user && user.role == 2 &&
                    <PrimaryButton
                        text={ "Add a Video" }
                        handler={ getAddVideoModal }
                    />
                }
            </div>
            <Modal child={ child } />
            <Alert response={ response } />
            <section className='w-full mx-auto h-dvh overflow-y-scroll snap-y snap-mandatory '>
                {
                    videos && videos.length > 0 && videos.map(( video, index ) => (
                        <ShortsContainer video={ video } key={ index } userInteracted={ userInteracted } />
                    ))
                }
            </section>
        </section>
    )
}

export default ReelsFeed