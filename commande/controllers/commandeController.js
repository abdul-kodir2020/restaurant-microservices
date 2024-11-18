const { sendToQueue, consume, channel, assertQueue } = require('../config/rabbitmq');
const Order = require('../models/commandeModel');

module.exports.makeOrder = async (req, res) => {
    try {
        const { customerName, menuId, quantity } = req.body;

        // if (!channel) {
        //     return res.status(500).json({ message: 'RabbitMQ channel is not available' });
        // }

        // Générer un ID unique pour la corrélation
        const correlationId = require('crypto').randomBytes(16).toString('hex');

        // Configurer la file d'attente pour la réponse
        const replyQueue = await assertQueue()
        
        sendToQueue('checkAvailability', { menuId, quantity }, {
            correlationId,
            replyTo: replyQueue.queue,
        });
        
        
        consume(replyQueue.queue, async (message, originalMessage) => {
            if (originalMessage.properties.correlationId === correlationId) {
                if (!message.exists) {
                    return res.status(404).json({ message: 'Menu item not found' });
                }

                if (!message.isAvailable) {
                    return res.status(400).json({ message: 'Menu item is not available' });
                }

                // Créer la commande
                const order = new Order({ customerName, menuId, quantity });
                const savedOrder = await order.save();

                res.status(201).json(savedOrder);
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error making order', error });
    }
}

module.exports.getOrders = async (req, res) => {
    
    
    try {
        const orders = await Order.find().populate('menuId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error getting orders', error });
    }
}

module.exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error });
    }
}

module.exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(deletedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
    }
}