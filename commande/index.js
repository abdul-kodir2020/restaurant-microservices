const express = require('express')
const app = express()

const cors = require('cors')

const dotenv = require('dotenv')
const { connectRabbitMQ } = require('./config/rabbitmq')
const connectDB = require('./config/db')
dotenv.config()
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/orders', require('./routes/commandeRoutes'))


app.get('/', (req, res) => {
  res.json('Hello World for commande')
})


app.listen(port, async () => {
  console.log(`listening on port ${port}`)
  await connectRabbitMQ().catch((err) => console.error('Failed to connect to RabbitMQ:', err));
})
connectDB()
