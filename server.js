const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

// Serve reports from 'user-reports' directory
app.use('/user-reports', express.static('/var/www/app.brokenlinksfinder.com/user-reports'));

app.set('views', './views');
app.set('view engine', 'html');

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');


});

// Handle terminal command execution and emit real-time feedback
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('runCommand', (command) => {
        console.log(`Executing: ${command}`);

        const process = exec(command);

        process.stdout.on('data', (data) => {
            socket.emit('terminalOutput', data);
        });

        process.stderr.on('data', (data) => {
            socket.emit('terminalOutput', `Error: ${data}`);
        });

        process.on('close', (code) => {
            socket.emit('terminalOutput', `Process exited with code ${code}`, 
            socket.emit('terminalOutput', 'Command completed successfully if code = 0')
            );
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 4302;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}` + ' Broken Links Finder is LIVE!!');
});