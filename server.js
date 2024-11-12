const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

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
        console.log(`Received command: ${command}`);

        // Execute the command
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                socket.emit('terminalOutput', `Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                socket.emit('terminalOutput', `Stderr: ${stderr}`);
                return;
            }

            // Save the output to a file
            const outputFilePath = path.join(__dirname, 'user-reports', `report_${Date.now()}.json`);
            fs.writeFileSync(outputFilePath, stdout);

            // Emit the file path to the client
            socket.emit('reportGenerated', outputFilePath);
            socket.emit('terminalOutput', `Report generated: ${outputFilePath}`);
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 4302;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} Broken Links Finder is LIVE!!`);
});
