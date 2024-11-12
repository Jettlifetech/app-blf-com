const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone'); 

// Set up timezone for moment.js
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

// Create user-reports directory if it doesn't exist
const reportsDir = '/var/www/app.brokenlinksfinder.com/user-reports';
if (!fs.existsSync(reportsDir)){
    fs.mkdirSync(reportsDir, { recursive: true });
}

// Serve reports from 'user-reports' directory
app.use('/user-reports', express.static(reportsDir));

app.set('views', './views');
app.set('view engine', 'html');

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});


// Handle terminal command execution and emit real-time feedback
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('runCommand', ({ command, reportType, domainName }) => {
        console.log(`Received command: ${command}, Report Type: ${reportType}, Domain: ${domainName}`);

        // Sanitize the domain name to be used in the file path
        const sanitizedDomainName = domainName.replace(/[^a-zA-Z0-9]/g, '_');

        // Format the current date and time to CDT and append it to the file name
        const dateTime = moment().tz('America/Chicago').format('MM-DD-YYYY_HH-mm-ss');
        const fileExtension = reportType === 'JSON' ? 'json' : 'csv';
        const outputFileName = `${sanitizedDomainName}_${dateTime}.${fileExtension}`;
        const outputFilePath = path.join(reportsDir, outputFileName);

        // Depending on the report type, use the appropriate command to generate either a JSON or CSV report
        const fullCommand = `${command} --output-format ${reportType.toLowerCase()}`;

        // Execute the command
        exec(fullCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                socket.emit('terminalOutput', `Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                socket.emit('terminalOutput', `Stderr: ${stderr}`);
            }

            try {
                // Save the report to the specified directory
                fs.writeFileSync(outputFilePath, stdout);
                console.log(`Report saved to: ${outputFilePath}`);

                // Emit the file path to the client
                const webPath = `/user-reports/${outputFileName}`;
                socket.emit('reportGenerated', webPath);
                socket.emit('terminalOutput', `Report generated: ${outputFileName}`);
            } catch (err) {
                console.error(`Error saving file: ${err.message}`);
                socket.emit('terminalOutput', `Error saving report: ${err.message}`);
            }
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
