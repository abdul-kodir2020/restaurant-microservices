const express = require('express')
const app = express()

const cors = require('cors');

const dotenv = require('dotenv')
dotenv.config()

const connectDB = require('./config/db');
// const { connectRabbitMQ, sendToQueue } = require('./config/rabbitmq');

const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Routes
app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
  res.send('Hello World for auth')
})

// app.post('/send', async (req, res) => {
//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).send('Message is required');
//     }

//     const response = sendToQueue("test")

//     res.json(response)

// });

app.listen(port, async() => {
  console.log(`listening on port ${port}`)
  // await connectRabbitMQ();
})
connectDB()
