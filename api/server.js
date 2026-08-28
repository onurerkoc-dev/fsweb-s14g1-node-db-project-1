const express = require("express");
const accountsRouter = require('./accounts/accounts-router');

const server = express();

server.use(express.json());
server.use('/api/accounts', accountsRouter);

server.get('/', (req, res) => {
  res.json({ message: 'Accounts API is running' });
});

module.exports = server;
