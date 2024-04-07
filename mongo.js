const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const password = process.env.DB_PASSWORD;
const connectionString = `mongodb+srv://andresanni1985:${password}@cluster0.5vdenbx.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0`;

//Conexion a mongodb
const connectDB = () => {
  mongoose
    .connect(connectionString)
    .then(() => {
      console.log('Database connected');
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = { connectDB };

