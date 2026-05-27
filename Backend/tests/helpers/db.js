const mongoose          = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

const connect = async () => {
  mongod = await MongoMemoryServer.create({ instance: { startupTimeout: 120000 } });
  await mongoose.connect(mongod.getUri());
};

const disconnect = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch { /* ignora erros de cleanup */ }
  if (mongod) await mongod.stop();
};

const clearAll = async () => {
  const cols = mongoose.connection.collections;
  await Promise.all(Object.values(cols).map(c => c.deleteMany({})));
};

module.exports = { connect, disconnect, clearAll };
