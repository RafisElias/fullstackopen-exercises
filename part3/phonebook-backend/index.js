const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

const { connectDataBase } = require('./mongo');

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

connectDataBase();

app.use(cors());
app.use(express.json());
morgan.token('resBody', (req) => JSON.stringify(req.body));

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :resBody'
  )
);

app.use(express.static('dist'));

app.get('/', (_, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.use('/api/persons', require('./routes/persons'));

app.get('/info', async (_, response) => {
  const personsFile = path.join(__dirname, 'assets', 'persons.json');
  try {
    const persons = fs.readFileSync(personsFile, 'utf8');
    const personsLength = JSON.parse(persons).length;
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('pt-br', {
      dateStyle: 'full',
      timeStyle: 'full'
    }).format(date);
    response.send(`<div>
    <p>Phonebook has info for ${personsLength} people</p>
    <p>${formattedDate}</p>
    </div>`);
  } catch (error) {
    console.log(error);
    response.status(400).send({ error: 'Problems' });
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, _, response, next) => {
  console.log(error?.message);
  if (error?.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Conectado ao mongoDB');
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
});

mongoose.connection.on('error', (err) => {
  const message = `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`;
  console.log(message);
});
