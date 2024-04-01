const express = require('express');
const cors = require('cors');

const app = express();

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Helo World!</h1>');
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    res.json(note);
  } else {
    res.status(404);
    res.json({ error: `id ${id} doesn't exist` });
  }
});

app.post('/api/notes', (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };
  notes = notes.concat(note);
  res.status(201).json(notes);
});

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => id !== note.id);
  console.log(notes);
  res.status(200);
  res.json(notes);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});

const generateId = () => {
  const maxId = notes.length === 0 ? 1 : Math.max(...notes.map((n) => n.id));
  return maxId + 1;
};
