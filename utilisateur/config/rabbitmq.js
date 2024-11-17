const amqp = require('amqplib');

let channel, connection;

async function connectRabbitMQ(retries = 5, delay = 3000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Attempt ${attempt} to connect to RabbitMQ...`);
            // Établit la connexion à RabbitMQ
            connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672');
            channel = await connection.createChannel();

            // S'assure que la file d'attente "tasks" existe
            await channel.assertQueue('tasks');
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