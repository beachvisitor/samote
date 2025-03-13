import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { FaKeyboard, } from 'react-icons/fa';
import { FiMove } from 'react-icons/fi';
import { useData } from '@/data';
import Loader from '@/loader';
import Auth from '@/auth.jsx';
import Draggable from 'react-draggable';
import Source from '@/source';
import { Keyboard } from '@/keyboard';
import socket from '@/socket';
import { cn } from '@/lib/utils';
import useTouches from '@/touches';
import '@/executor';

function App() {
    const [video, setVideo] = useState(null);
    const [videoLoading, setVideoLoading] = useState(true);
    const keyboard = useRef(null);
    const [keyboardState, setKeyboardState] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [allowClick, setAllowClick] = useState(false);
    const { state, loading, user } = useData();
    const { touches, setTouches } = useTouches(video);

    const update = () => {
        const keyboardHeight = keyboard.current?.offsetHeight || 0;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight - keyboardHeight;
        const aspect = video.width / video.height;

        let width = windowWidth;
        let height = width / aspect;

        if (height > windowHeight) {
            height = windowHeight;
            width = height * aspect;
        }

        video.style.width = `${width}px`;
        video.style.height = `${height}px`;
    }

    useEffect(() => {
        if (!video) return;
        setVideoLoading(true);
        const player = new window.JSMpeg.Player('', {
            canvas: video,
            audio: false,
            source: Source,
            onVideoDecode: () => {
                if (!state || !user?.auth || !user?.access?.view) return;
                update();
                setVideoLoading(false);
            },
        });

        const write = (payload) => player.source.write(payload);
        // Fixes "JSMpeg: WASM module not compiled yet"
        setTimeout(() => socket.on('stream:write', write), 0);
        return () => {
            player?.destroy?.();
            socket.off('stream:write', write);
        };
    }, [video, state, user?.auth, user?.access?.view]);

    useEffect(() => {
        if (!video) return;
        setTimeout(update, 100);
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [video, keyboardState]);

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
                panning={{ disabled: true }}
                doubleClick={{ mode: 'toggle' }}
                disabled={touches}
            >
                <TransformComponent wrapperClass={'!h-full'} contentClass={'flex items-center justify-center !h-full'}>
                    <canvas
                        ref={setVideo}
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
                <div className={'fixed flex flex-col outline outline-1 outline-secondary items-center rounded-lg right-1 top-1/2 overflow-hidden backdrop-blur-md'}>
                    <Button
                        onClick={() => handleClick(() => setTouches(prev => !prev))}
                        variant={'ghost'}
                        className={cn(
                            '!text-foreground/75 !bg-background/50 rounded-none p-3 w-max h-max',
                            !touches && '!text-foreground !bg-accent/50'
                        )}
                    >
                        <FiMove className={'!w-5 !h-5'}/>
                    </Button>
                    <Button
                        disabled={!user?.access?.keyboard}
                        onClick={() => handleClick(() => setKeyboardState(prev => !prev))}
                        variant={'ghost'}
                        className={cn(
                            '!text-foreground/75 !bg-background/50 rounded-none p-2.5 w-max h-max',
                            keyboardState && '!text-foreground !bg-accent/50'
                        )}
                    >
                        <FaKeyboard className={'!w-6 !h-6'}/>
                    </Button>
                </div>
            </Draggable>
        </div>
    )
}

export default App
