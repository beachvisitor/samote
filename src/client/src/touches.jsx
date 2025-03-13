import { useEffect, useState } from 'react';
import socket from '@/socket';

function useTouches(stream) {
    const [touches, setTouches] = useState(true);

    const convertPosition = (x, y) => ({
        x: Math.round(x * (stream.width / stream.offsetWidth)),
        y: Math.round(y * (stream.height / stream.offsetHeight))
    });

    useEffect(() => {
        if (!stream) return;
        let state = '';
        let position = { x: 0, y: 0 };
        let interval;
        let time = 0;

        const send = (action, position) =>
            socket.emit(`touch:${action}`, position.x, position.y);

        const down = (e) => {
            const now = Date.now();
            if (state || !touches) return;
            time = now;
            state = 'down';
            position = convertPosition(e.offsetX, e.offsetY);
            send('down', position);
            clearInterval(interval);
            interval = setInterval(() => state === 'down' && send('update', position), 250);

        }

        const move = (e) => {
            if (!state || !touches) return;
            state = 'update';
            position = convertPosition(e.offsetX, e.offsetY);
            send('update', position);
            clearInterval(interval);
            interval = setInterval(() => state === 'update' && send('update', position), 100);
        }

        const up = () => {
            if (!touches) return;
            state = 'up';
            send('up', position);
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
            setTimeout(() => state = '', 250);
        }

        stream.addEventListener('pointerdown', down);
        stream.addEventListener('pointermove', move);
        stream.addEventListener('pointerup', up);

        return () => {
            stream.removeEventListener('pointerdown', down);
            stream.removeEventListener('pointermove', move);
            stream.removeEventListener('pointerup', up);
        }
    }, [stream, touches]);

    return { touches, setTouches };
}

export default useTouches;