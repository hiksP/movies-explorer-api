const express = require('express');
const mongoose = require('mongoose');

const PORT = 3000;

const app = express();

app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
  });

app.use(express.json());

async function main() {
  await mongoose.connect('mongodb://127.0.0.1/bitfilmsdb');
  
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    });
  }
  
main();