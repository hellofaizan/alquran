
"use client"

import React, { useState, useRef, useEffect } from 'react'
import { BsArrowLeftShort } from "react-icons/bs"
import { BsArrowRightShort } from "react-icons/bs"
import { FaPlay } from "react-icons/fa"
import { FaPause } from "react-icons/fa"

type props = {
    surah: any
}

const Player = ({ surah }: props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // references
    const audioPlayer = useRef<any>(null);   // reference our audio component
    const progressBar = useRef<any>(null);   // reference our progress bar
    const animationRef = useRef<any>(null);  // reference the animation

    useEffect(() => {
        const seconds = Math.floor(audioPlayer?.current?.duration) || 0;
        setDuration(seconds);
        progressBar.current.max = seconds;
    }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

    const calculateTime = (secs: any) => {
        const minutes = Math.floor(secs / 60);
        const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${returnedMinutes}:${returnedSeconds}`;
    }

    const togglePlayPause = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue);
        if (!prevValue) {
            audioPlayer?.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying)
        } else {
            audioPlayer?.current.pause();
            cancelAnimationFrame(animationRef.current);
        }
    }

    const whilePlaying = () => {
        if (audioPlayer.current) {
            progressBar.current.value = audioPlayer.current.currentTime;
        }
        changePlayerCurrentTime();
        animationRef.current = requestAnimationFrame(whilePlaying);
    }

    const changeRange = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changePlayerCurrentTime();
    }

    const changePlayerCurrentTime = () => {
        if (progressBar.current) {
            progressBar.current.style.setProperty('--seek-before-width', `${progressBar.current.value / duration * 100}%`)
            setCurrentTime(progressBar.current.value);
        }
    }

    const backThirty = () => {
        progressBar.current.value = Number(progressBar.current.value -= 15);
        changeRange();
    }

    const forwardThirty = () => {
        progressBar.current.value = Number(progressBar.current.value += 15);
        changeRange();
    }

    return (
        <div className="flex fixed bottom-0 w-full md:w-2/5 justify-center items-center">
            <div className="flex w-full items-center justify-between gap-4 bg-[#393939]/40 backdrop-blur-md px-4 py-3 text-white">
                <audio ref={audioPlayer} src={`https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surah}.mp3`} preload="metadata"></audio>
                <div className='flex gap-5'>
                    <button onClick={backThirty}><BsArrowLeftShort /> 15</button>
                    <button onClick={togglePlayPause}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button onClick={forwardThirty}>15 <BsArrowRightShort /></button>
                </div>

                <div className='flex flex-1 w-full gap-2'>
                    {/* current time */}
                    <div>{calculateTime(currentTime)}</div>

                    {/* progress bar */}
                    <input type="range" className="w-full" defaultValue="0" ref={progressBar} onChange={changeRange} />

                    {/* duration */}
                    <div>{(duration && !isNaN(duration)) && calculateTime(duration)}</div>
                </div>
            </div>
        </div>
    )
}

export default Player
