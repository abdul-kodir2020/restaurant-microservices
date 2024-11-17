const amqp = require('amqplib');
let channel, connection;

async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
}

async function sendToQueue(queueName, message, options = {}) {
    if (!channel) throw new Error('RabbitMQ channel not initialized');
    const msgBuffer = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(queueName, msgBuffer, options);
}

async function consume(queueName, onMessage) {
    if (!channel) throw new Error('RabbitMQ channel not initialized');
    await channel.assertQueue(queueName);
    channel.consume(queueName, (message) => {
        if (message !== null) {
            const content = JSON.parse(message.content.toString());
            onMessage(content, message);
            channel.ack(message); // Accuser réception du message après traitement
        }
    });
}
module.exports = { connectRabbitMQ, sendToQueue, consume };