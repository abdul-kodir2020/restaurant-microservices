const amqp = require('amqplib');
const Menu = require('../models/menuModel');

let channel, connection;

async function connectRabbitMQ(retries = 5, delay = 3000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Attempt ${attempt} to connect to RabbitMQ...`);
            // Établit la connexion à RabbitMQ
            connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672');
            channel = await connection.createChannel();

            await channel.assertQueue('checkAvailability');
            console.log('Connected to RabbitMQ');
            return; // Succès, on quitte la boucle
        } catch (error) {
            console.error(`Error connecting to RabbitMQ on attempt ${attempt}:`, error);
            if (attempt < retries) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise((resolve) => setTimeout(resolve, delay)); // Attend avant la prochaine tentative
            } else {
                console.error('Max retries reached. Exiting...');
                process.exit(1); // Quitte l'application après échec
            }
        }
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