import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FaKeyboard, } from 'react-icons/fa';
import { useData } from "@/data";
import Loader from "@/loader";
import Auth from "@/auth.jsx";
import Draggable from 'react-draggable';
import Reader from '@/reader';
import { Keyboard } from '@/keyboard';
import useTouches from "@/touches";

function App() {
    const [video, setVideo] = useState(null);
    const [videoLoading, setVideoLoading] = useState(true);
    const keyboard = useRef(null);
    const [keyboardState, setKeyboardState] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [allowClick, setAllowClick] = useState(false);
    const { state, loading, user } = useData();
    useTouches(video);

    useEffect(() => {
        if (!video || !user?.auth) {
            window.stream = true;
            return;
        }

        window.stream = false;
        setVideoLoading(true);

        const reader = new Reader({
            url: `${location.origin}/live/screen/whep`,
            onError: (e) => console.error(e),
            onTrack: (e) => video.srcObject = e.streams[0]
        });

        return () => reader.handleError(new Error());
    }, [video, state, user?.auth, user?.access?.view]);

    useEffect(() => {
        if (!video) return;

        const update = () => {
            const keyboardHeight = keyboard.current?.offsetHeight || 0;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight - keyboardHeight;
            const aspect = video.videoWidth / video.videoHeight;

            let width = windowWidth;
            let height = width / aspect;

            if (height > windowHeight) {
                height = windowHeight;
                width = height * aspect;
            }

            video.style.width = `${width}px`;
            video.style.height = `${height}px`;
        }
        const onload = () => {
            if (!user?.access?.view) return;
            setVideoLoading(false);
            update();
        }

        setTimeout(update, 300);
        video.addEventListener('loadeddata', onload);
        window.addEventListener('resize', update);

        return () => {
            video.removeEventListener('loadeddata', onload);
            window.removeEventListener('resize', update);
        };
    }, [video, keyboardState, state, user?.auth, user?.access?.view]);

    useEffect(() => {
        if (videoLoading || !user?.access?.keyboard) setKeyboardState(false);
    }, [videoLoading, user?.access?.keyboard]);

    const handleClick = (func) => {
        if (allowClick) func();
        setAllowClick(false);
    }

    if (loading) return;
    if (!user?.auth) return <Auth/>;

    return (
        <div className={'flex flex-col items-center justify-between touch-none w-full h-[100dvh] overflow-hidden'}>
            <Loader active={videoLoading}/>
            <TransformWrapper
                panning={{disabled: true}}
                doubleClick={{disabled: true}}
                // disablePadding
                onZoomStart={() => disableInteractions.current = true}
                onZoomStop={() => disableInteractions.current = false}
            >
                <TransformComponent wrapperClass={'!h-full'} contentClass={'flex items-center justify-center !h-full'}>
                    <video
                        ref={setVideo}
                        autoPlay
                        muted
                        playsInline
                        className={'transition-all duration-300 flex-shrink-0 object-contain select-none touch-pinch-zoom'}
                    />
                </TransformComponent>
                <div ref={keyboard} className={'w-full'}>
                    <Keyboard className={`transition-all duration-300 ${keyboardState ? 'max-h-screen' : 'max-h-0'}`}/>
                </div>
            </TransformWrapper>
            <Draggable
                onStart={() => setDragging(false)}
                onDrag={() => setDragging(true)}
                onStop={(e) => {
                    if (!dragging) {
                        setAllowClick(true);
                        setTimeout(() => !e.type.includes('mouse') && e?.target?.click(), 0)
                    }
                    setDragging(false);
                }}
            >
                <div className={'fixed flex flex-col outline outline-1 outline-secondary items-center gap-1 rounded-lg right-1 top-1/2 overflow-hidden bg-background/45 backdrop-blur-md'}>
                    <Button
                        disabled={!user?.access?.keyboard}
                        onClick={() => handleClick(() => setKeyboardState(prev => !prev))}
                        variant={'ghost'}
                        className={'rounded-none p-2.5 w-max h-max bg-transparent'}
                    >
                        <FaKeyboard className={'!w-6 !h-6'}/>
                    </Button>
                </div>
            </Draggable>
        </div>
    )
}

export default App
