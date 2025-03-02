import axios from 'axios';
import socket from '@/sockets';

const api = axios.create({
    baseURL: location.origin
});

const waitSocket = () => {
    return new Promise((resolve) => {
        if (socket.id) return resolve(socket);
        socket.once('connect', () => {
            resolve(socket);
        });
    });
};

api.interceptors.request.use(async req => {
    await waitSocket();
    const id = localStorage.getItem('id');
    if (id) req.headers.Authorization = `Id ${id}`;
    return req;
});

export default api;