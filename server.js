const express = require('express');
const mongoose = require('mongoose');

const users = require('./routers/api/users');
const profile = require('./routers/api/profile');
const posts = require('./routers/api/posts');

const app = express();

//db config
const db = require('./config/keys').mongoURI;

//connect to mongoDB

mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello!'));

//use routers
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);



const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

