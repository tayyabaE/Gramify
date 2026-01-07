import React, { useEffect, useRef, useState } from 'react'
import Controls from './Controls'
import Meta from './Meta'
import CommentSection from './CommentSection'
import PrimaryButton from '../buttons/PrimaryButton'
import Alert from '../Alert'
import AxiosInstance from '../../../services/AxiosInstance'
import { errorHandler } from '../../../utils/helper'

const renderDescription = (text) => {
    return text.split(/(\#[a-zA-Z0-9_]+)/g).map((part, index) => {
        if (part.startsWith('#')) {
            return (
                <a href={part} key={ index } className="bg-primary-500/10 px-1 font-medium">{ part }</a>
            )
        } else {
            return <span key={ index } >{ part }</span>
        }
    })
}

const ShortsContainer = ({ video, index, userInteracted }) => {
    
    const [ isMuted, setIsMuted ] = useState(true)
    const [ isOpened, setIsOpened ] = useState(false)
    const [ response, setResponse ] = useState({})
    const [ isFirstTime, setIsFirstTime ] = useState(true)
    const videoRef = useRef(null)

    useEffect(() => {
        const el = videoRef.current
        let isPlaying = false

        const handlePlayback = async (entry) => {
            if (!el) return

            try {
                if (entry.isIntersecting) {
                    if (!isPlaying) {
                        await el.play()
                        if (userInteracted || index === 0) {
                            el.muted = false
                            setIsMuted(false)
                        } else {
                            el.muted = true
                            setIsMuted(true)
                        }
                        isPlaying = true
                        
                        isFirstTime && 
                        setTimeout(() => {
                            countView(video._id)
                        }, 1500)
                    }
                } else {
                    el.pause()
                    el.muted = true
                    setIsMuted(true)
                    isPlaying = false
                    setIsOpened(false)
                }
            } catch (err) {
                console.warn('Playback error:', err)
            }
        }

        const observer = new IntersectionObserver(
            ([entry]) => handlePlayback(entry),
            { threshold: 0.6 }
        )

        if (el) observer.observe(el)

        return () => {
            if (el) observer.unobserve(el)
        }
    }, [userInteracted, index])

    const muteToggler = () => {
        setIsMuted(!isMuted)
    }
    
    const triggerCommentSection = (e) => {
        if (e) e.preventDefault()
        setIsOpened(!isOpened)
    }

    useEffect(() => {
        if (response.message || !isFirstTime) getVideoById(video._id)
    }, [ response.message, isFirstTime ])

    const getVideoById = async (id) => {
        try {
            const resp = await AxiosInstance.get(`/api/video/getOne/${ id }`)
            video.comments = resp.data.comments
            video.likes = resp.data.likes

        } catch (err) {
            setResponse({ error: errorHandler(err) })
        } finally {
            setTimeout(() => {
                setResponse({})
            }, 3000);
        }
    }

    const countView = async (id) => {
        try {
            const resp = await AxiosInstance.put(`/api/video/view/${ id }`)
            setIsFirstTime(false)
        } catch (err) {
            setResponse({ error: errorHandler(err) })
        } finally {
            setTimeout(() => {
                setResponse({})
            }, 3000);
        }
    }
    
    return (
        <div className='w-full grid grid-cols-1 md:grid-cols-3'>
            <div />
            <Alert response={ response } />
            <div className='w-full sm:w-auto relative h-dvh p-3 aspect-9/16 flex items-center justify-center'>
                <div className='snap-center mx-auto rounded-xl overflow-hidden'>
  {video.media?.mediaType === "video" ? (
  <video
    ref={videoRef}
    src={video.media?.url} // safe access
    autoPlay
    muted={isMuted}
    playsInline
    loop
    onClick={muteToggler}
  />
) : video.media?.mediaType === "image" ? (
  <img
    src={video.media?.url}
    alt={video.title}
    className="w-full h-full object-cover"
  />
) : (
  <p className="text-center text-red-500">Media not available</p>
)}


  {video.media.mediaType === "video" && (
    <Controls mute={{ isMuted, setIsMuted }} />
  )}

  <div className='absolute w-full p-5 left-1/2 -translate-x-1/2 bottom-0 bg-linear-0 to-primary-100/0 from-primary-100/90 from-65%'>
    <h3 className='text-primary-500 text-xl font-bold mt-5'>
      { "@"+video.creator.username }
    </h3>
    <h3 className='text-black text-lg mt-2'>{ video.title }</h3>
    <p className='text-black/65 mt-1 w-[70%]'>
      { renderDescription(video.description) }
    </p>
  </div>

  <Meta
    video={video}
    setResponse={setResponse}
    triggerCommentSection={triggerCommentSection}
  />
</div>

            </div>
            <CommentSection video={ video } id={ video.id } comments={ video.comments } isOpened={ isOpened } setResponse={ setResponse } triggerCommentSection={ triggerCommentSection } />
        </div>
    )
}

export default ShortsContainer