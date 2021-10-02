const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const calculatorRoutes = require('./routes/calculator');

const app = express()

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/admin", {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use("/api/v1", authRoutes);
app.use("/api/v1", calculatorRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(80, () => {
    console.log("Connection opened on port 80")
});