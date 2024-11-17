const express = require('express')
const app = express()

const cors = require('cors')

const dotenv = require('dotenv')
dotenv.config()

const connectDB = require('./config/db')
const { connectRabbitMQ, consumeMessages } = require('./config/rabbitmq')
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/menus', require('./routes/menuRoutes'))

app.get('/', (req, res) => {
  res.send('Hello World for menu')
})

app.listen(port, async () => {
  console.log(`listening on port ${port}`)
  await connectRabbitMQ()
    .then(() => consumeMessages())
    .catch((err) => console.error('RabbitMQ setup failed:', err));
})
connectDB()
