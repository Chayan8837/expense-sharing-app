const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


const bodyParser = require('body-parser');
const expenseRoutes = require('./routes/expenseRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const downloadRoutes =require("./routes/downloadRoutes")

 const userRoutes = require('./routes/user');

const app = express();
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/download',downloadRoutes );


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT},mongodb connected`)))
  .catch((error) => console.log(error));
