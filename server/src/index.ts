import './loadEnv'; // Must be the first import
import express from 'express';
import path from 'path';

import app from './server';
import logger from './shared/Logger';

const rootPath = path.join(__dirname, '../..');
app.use(express.static(path.join(rootPath, 'build')));

app.get('/ping', function (req, res) {
return res.send('pong');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(rootPath, 'build', 'index.html'));
});

// Start the server
const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
