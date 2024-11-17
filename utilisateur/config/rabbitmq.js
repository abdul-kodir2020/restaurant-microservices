const amqp = require('amqplib');

let channel, connection;

async function connectRabbitMQ() {
    try {
        // Établit la connexion à RabbitMQ
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        // connection = await amqp.connect('amqp://admin:admin@localhost:5672');
        channel = await connection.createChannel();

        // S'assure que la file d'attente "tasks" existe
        await channel.assertQueue('tasks');
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
}

function sendToQueue(message) {
    if (!channel) {
        console.error('Channel is not initialized. Call connectRabbitMQ first.');
        return Error('Channel is not initialized. Call connectRabbitMQ first.');
    }
    try {
        // Envoi du message à la file d'attente spécifiée
        channel.sendToQueue('tasks', Buffer.from(message));
        console.log(`Message sent to queue: ${message}`);
        return `Message sent to queue: ${message}`
    } catch (error) {
        console.error('Error sending message to RabbitMQ:', error);
        return Error('Error sending message to RabbitMQ:'+ error)
    }
}

module.exports = {sendToQueue, connectRabbitMQ}