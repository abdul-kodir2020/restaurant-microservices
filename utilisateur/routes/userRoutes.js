
const router = require('express').Router()

const { getUserProfile } = require('../controllers/userController');
const { modifyUser } = require('../controllers/userController');
const { deleteUser } = require('../controllers/userController');
const { getAllUsers } = require('../controllers/userController');
const { login } = require('../controllers/userController');
const { register } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getUserProfile);
router.get('/', authMiddleware, getAllUsers);
router.put('/:id', authMiddleware, modifyUser);
router.delete('/:id', authMiddleware, deleteUser); 

module.exports = router;