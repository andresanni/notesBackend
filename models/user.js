const { Schema, model } = require('mongoose');

//Crear Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
});

//Adaptar el toJson a la presentacion de datos que queremos
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

//Crear la clase del modelo
const User = model('User', userSchema);

module.exports = User;
