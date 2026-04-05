const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
mongoose.set('strictQuery', false);

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const projectRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth');

app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;