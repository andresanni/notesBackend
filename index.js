const express = require('express');
const cors = require('cors');
const { connectDB } = require('./mongo');
const { Note } = require('./models/NoteModel');
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

app.get('/', (req, res) => {
  res.send('<h1>Helo World!</h1>');
});

app.get('/api/notes', (req, res) => {
  Note.find({})
    .then((allNotes) => res.json(allNotes))
    .catch((error) => console.log(error));
});

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params;

  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404);
        res.json({ error: `id ${id} doesn't exist` });
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/api/notes', (req, res, next) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
  });

  note
    .save()
    .then((savedNote) => res.status(201).json(savedNote))
    .catch((error) => next(error));
});

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params;
  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params;

  const { content, important } = req.body;

  Note.findByIdAndUpdate(id, {content, important}, { new: true, runValidators: true, context:'query'})
    .then((updatedNote) => res.status(200).json(updatedNote))
    .catch((error) => next(error));
});

app.use((error, req, res, next) => {
  console.log(error.name);

  if (error.name === 'CastError') {
    res.status(400).end();
  } else if (error.name === 'ValidationError') {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
