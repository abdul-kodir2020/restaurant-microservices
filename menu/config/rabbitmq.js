const amqp = require('amqplib');
const Menu = require('../models/menuModel');

let channel, connection;

async function connectRabbitMQ() {
    try {
        // Établit la connexion à RabbitMQ
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        // S'assure que la file d'attente "tasks" existe
        await channel.assertQueue('checkAvailability');
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
}


async function consumeMessages() {
    if (!channel) throw new Error('RabbitMQ channel not initialized');

    channel.consume('checkAvailability', async (message) => {
        const request = JSON.parse(message.content.toString());

        try {
            const menuItem = await Menu.findById(request.menuId);

            const response = {
                menuId: request.menuId,
                isAvailable: menuItem ? menuItem.isAvailable : false,
                exists: !!menuItem,
            };

            // Répondre sur une file d'attente de réponse
            channel.sendToQueue(
                message.properties.replyTo,
                Buffer.from(JSON.stringify(response)),
                { correlationId: message.properties.correlationId }
            );

            // Accuser réception
            channel.ack(message);
        } catch (error) {
            console.error('Error processing RabbitMQ message:', error);
        }
    });
}

module.exports = {connectRabbitMQ, consumeMessages}