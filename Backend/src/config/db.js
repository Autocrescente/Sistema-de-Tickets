const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS:         10000,
      socketTimeoutMS:          45000,
    });
    console.log(`MongoDB ligado: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Erro ao ligar ao MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
