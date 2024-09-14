const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use('/auth', authRoutes);

const port = 3001;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
module.exports = app;