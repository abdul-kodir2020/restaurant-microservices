const router = require('express').Router()

const { makeOrder, getOrders, updateOrder, deleteOrder } = require("../controllers/commandeController");
const authMiddleware = require("../middleware/authMiddleware");

router.post('/order', authMiddleware, makeOrder);
router.get('/order', authMiddleware, getOrders);
router.patch('/order/:id', authMiddleware, updateOrder);
router.delete('/order/:id', authMiddleware, deleteOrder);


module.exports = router