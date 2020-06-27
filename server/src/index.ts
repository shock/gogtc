import app from './server';
import express from 'express';
import path from 'path';

import logger from './shared/Logger';

import Knex from 'knex'
import { Model } from 'objection'
import knexConfig from './db/knexfile'

// Initialize knex.
const knex = Knex(knexConfig.development)

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex() method.
Model.knex(knex)

const rootPath = path.join(__dirname, '../..');
app.use(express.static(path.join(rootPath, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(rootPath, 'build', 'index.html'));
});

// Start the server
const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
