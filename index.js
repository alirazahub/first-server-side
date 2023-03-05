const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {MONGO_URI} = require('./keys'); 
const app = express();
const PORT = 3000;
const authRoutes = require('./routes/authRoutes');
const requireToken = require('./middleware/requireToken');

require('./models/UserSchema');
app.use(bodyParser.json());

app.use('/api', authRoutes)


mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log('Connected to mongoDB');
});
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to mongoDB', err);
});



app.listen(PORT, () => {
    console.log(`This app listening at http://localhost:${PORT}`)
});