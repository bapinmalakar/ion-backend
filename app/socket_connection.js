const helper = require('./helper');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Socket id is: ', socket.id);
        socket.emit('my-socket-id', socket.id);
        global.current_id = socket.id;

        socket.on('process-my-file', async (reqData) => {
            console.log('Process Data request made: ', reqData.socketId, reqData.fileName);
            try {
                const fileExist = helper.readDataFromFile(reqData.fileName);
                if (!fileExist) {
                    io.sockets.connected[reqData.socketId].emit('file-error', 'File not present');
                } else {
                    let [sendData, finish] = helper.analyticsProcess();
                    if (io.sockets.connected[reqData.socketId]) {
                        if (finish) {
                            await helper.updateOrAddFile(sendData, reqData.fileName);
                            io.sockets.connected[reqData.socketId].emit('file-read-finish', true)
                        }
                        io.sockets.connected[reqData.socketId].emit('file-analytics', sendData);
                    }
                }
            } catch (err) {
                console.log('sOCKET Error is: ', err);
            }
        })

        socket.on('process-next-data', async (reqData) => {
            try {
                let [sendData, finish] = helper.analyticsProcess();
                if (io.sockets.connected[reqData.socketId]) {
                    if (finish) {
                        await helper.updateOrAddFile(sendData, reqData.fileName);
                        io.sockets.connected[reqData.socketId].emit('file-read-finish', true);
                    } 
                    io.sockets.connected[reqData.socketId].emit('file-analytics', sendData);
                }
            } catch (err) {
                console.log('Error is: ', err);
            }

        })

        socket.on('disconnect', () => {
            console.log('Socket is disconnect with id: ', socket.id);
            global.current_id = '';
        })
    })
}