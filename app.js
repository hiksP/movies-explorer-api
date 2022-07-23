const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const PORT = 3000;

const app = express();

app.use(cookieParser());
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