import { useEffect, useRef } from "react";
import socket from "@/sockets";

function useTouches(video) {
    const disableInteractions = useRef(false);

    const convertPosition = (x, y) => ({
        x: Math.round(x * (video.videoWidth / video.offsetWidth)),
        y: Math.round(y * (video.videoHeight / video.offsetHeight))
    });

    useEffect(() => {
        if (!video) return;
        let state = '';
        let position = { x: 0, y: 0 };
        let interval;
        let time = 0;

        const send = (action, position) => {
            socket.emit(`touch:${action}`, position.x, position.y);
        }

        const down = (e) => {
            const now = Date.now();
            if (state || disableInteractions.current) return;
            time = now;
            state = 'down';
            position = convertPosition(e.offsetX, e.offsetY);
            send('down', position);
            clearInterval(interval);
            interval = setInterval(() => state === 'down' && send('update', position), 250);

        }

        const move = (e) => {
            if (!state || disableInteractions.current) return;
            state = 'update';
            position = convertPosition(e.offsetX, e.offsetY);
            send('update', position);
            clearInterval(interval);
            interval = setInterval(() => state === 'update' && send('update', position), 100);
        }

        const up = () => {
            if (disableInteractions.current) return;
            state = 'up';
            send('up', position);
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
            setTimeout(() => state = '', 250);
        }

        video.addEventListener('pointerdown', down);
        video.addEventListener('pointermove', move);
        video.addEventListener('pointerup', up);

        return () => {
            video.removeEventListener('pointerdown', down);
            video.removeEventListener('pointermove', move);
            video.removeEventListener('pointerup', up);
        }
    }, [video]);
}

export default useTouches;