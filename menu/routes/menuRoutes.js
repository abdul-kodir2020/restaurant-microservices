const { addMenu, getMenus, updateMenu, deleteMenu } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = require('express').Router()

router.post('/menu', authMiddleware, addMenu);
router.get('/menu', authMiddleware, getMenus);
router.put('/menu/:id', authMiddleware, updateMenu);
router.delete('/menu/:id', authMiddleware, deleteMenu);

module.exports = router