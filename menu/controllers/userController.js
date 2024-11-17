const Menu = require("../models/menuModel");

module.exports.addMenu = async (req, res,) => {
    try {
        const { name, description, price, category, isAvailable } = req.body;

        const menu = new Menu({
            name,
            description,
            price,
            category,
            isAvailable,
        });

        const savedMenu = await menu.save();

        res.status(201).json(savedMenu);
    } catch (error) {
        res.status(500).json({ message: 'Error adding', error })
    }
}

module.exports.getMenus = async (req, res) => {
    try {
        const menus = await Menu.find();
        res.status(200).json(menus);
    } catch (error) {
        res.status(500).json({ message: 'Error reading : ', error })
    }
}

module.exports.updateMenu = async (req, res) => {
    try {
        const updatedMenu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedMenu) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.status(200).json(updatedMenu);
    } catch (error) {
        res.status(500).json({ message: 'Error updating : ', error })
    }
}

module.exports.deleteMenu = async (req, res) => {
    try {
        const deletedMenu = await Menu.findByIdAndDelete(req.params.id);

        if (!deletedMenu) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // Publier un message RabbitMQ
        publishToQueue('menuDeleted', { action: 'delete', data: deletedMenu });

        res.status(200).json(deletedMenu);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting : ', error })
    }
}