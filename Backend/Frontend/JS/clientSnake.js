const socket = io('http://localhost:8080');

const socketReg = (regObj) => {
    socket.emit('register', regObj);
}