const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./config/db.js');
const userRoute = require('./routes/userRoute.js');
const cors = require('cors');




connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(cors());

app.use(express.json());

app.use('/api/user', userRoute)
app.use('/api/property', require('./routes/propertyRoute.js'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});