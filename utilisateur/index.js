const express = require('express')
const app = express()

const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const amqp = require('amqplib');

const port = process.env.PORT || 3000

const connectDB = async () =>{
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Base de données utilsateur connectée");
    })
    .catch(err => {
        console.log(err);
    })
}

let channel, connection;

async function connectRabbitMQ() {
    try {
        // Établit la connexion à RabbitMQ
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        // S'assure que la file d'attente "tasks" existe
        await channel.assertQueue('tasks');
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
}

// app.post('/send', async (req, res) => {
//     const { message } = req.body;
  
//     if (!message) {
//       return res.status(400).send('Message is required');
//     }
  
//     try {
//       channel.sendToQueue('tasks', Buffer.from(message));
//       console.log(`Message sent to RabbitMQ: ${message}`);
//       res.send('Message sent to RabbitMQ');
//     } catch (error) {
//       console.error('Error sending message to RabbitMQ:', error);
//       res.status(500).send('Failed to send message');
//     }
// });

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World for auth')
})

app.listen(port, async () => {
  console.log(`listening on port ${port}`)
//   await connectRabbitMQ();
})
connectDB()
