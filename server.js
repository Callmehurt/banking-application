require('dotenv').config();

//async errors
require('express-async-errors');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');


//route imports
const {customerAuth, customer, account} = require('./routes')

//app initiate
const app = express();
const connectDB = require('./database/connect');


//middlewares
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');


app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

app.use(credentials);
app.use(cors(corsOptions));

app.use(cookieParser());


//routes
app.get('/', (req, res) => {
    res.send('<h1>Hello backend</h1>')
})

customerAuth(app);
customer(app);
account(app);


//call middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 4000

const start = async () => {
    try{

        await connectDB(process.env.MONGO_URI_ATLAS)
        app.listen(port, console.log(`Server listening to port ${port}`));

    }catch(err){
        console.log(err);
    }
}


//start web server
start();