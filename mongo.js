const Note = require('./models/note');
const mongoose = require('mongoose');

require('dotenv').config();

const mongo_uri = process.env.TEST_MONGO_URI;

mongoose.connect(mongo_uri).then(() => {
  
  if (process.argv.length == 3) {
    const noteContentToAdd = process.argv[2];

    const noteToAdd = new Note({ content: noteContentToAdd, important: false });

    noteToAdd.save().then((savedNote) => {
      console.log(savedNote);
      mongoose.connection.close();
      process.exit(0);
    });
  } else if (process.argv.length == 2) {
    Note.find({}).then((allNotes) => {
      console.log(allNotes);
      mongoose.connection.close();
      process.exit(0);
    });
  }
});
