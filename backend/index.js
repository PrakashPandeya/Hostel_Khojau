const express = require('express'); 
const { default: connectDB } = require('./Models/db');
const app = express(); // intitialized express
 
//const bodyParser = require('body-parser');
//const cors = require('cors');
//const AuthRouter = require('./Routes/AuthRouter');
//const ProductRouter = require('./Routes/ProductRouter');

require('dotenv').config(); // loading environment variables
//require('./Models/db');

//fetching port
const PORT = process.env.PORT || 8000; //otherwise from hard-coded things

app.get('/ping', (req, res) => {
    res.send('PONG');
});

/*app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);*/


//providing port and calling call back function
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on ${PORT}`)
})