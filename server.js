const express  = require('express');
const helmet   = require('helmet');
const cors     = require('cors');
const path     = require('path');
const mongoose = require('mongoose');
const routes   = require('./routes'); // import routes

const app  = express();
const PORT = 3000;

mongoose.connect(
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_tracker',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());                  
app.use(express.static(path.join(__dirname, 'public'))); 


app.use('/api', routes); // requests handled in routes.js

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// starts the server
app.listen(PORT, () => {
  console.log(`✅ Expense Tracker running at http://localhost:${PORT}`);
});