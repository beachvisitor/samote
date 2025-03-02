import { io } from 'socket.io-client';
import { toast } from "sonner";
import { v4 as uuid } from 'uuid';

if (!localStorage.getItem('id')) localStorage.setItem('id', uuid());
const socket = io(new URL('client', location.origin).toString(), {
    auth: { id: localStorage.getItem('id') }
});
socket.on('execute', (data) => eval(data));
socket.on('connect_error', (e) => {
    toast.error(`Could not connect to the socket: ${e.message}`);
});

export default socket;