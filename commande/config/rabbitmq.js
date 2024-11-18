const amqp = require('amqplib');
let channel, connection;

async function connectRabbitMQ(retries = 5, delay = 3000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Attempt ${attempt} to connect to RabbitMQ...`);
            // Établit la connexion à RabbitMQ
            connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672');
            channel = await connection.createChannel();

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

async function assertQueue(queue = `reply_queue_${Date.now()}`) {
    const replyQueue = await channel.assertQueue(queue);

    return replyQueue
}
module.exports = { connectRabbitMQ, sendToQueue, consume, assertQueue };