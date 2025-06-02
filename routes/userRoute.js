const express = require('express');
const router = express.Router();
const { UserRegister, login,logout, getUserById, getAllUsers} = require('../controllers/userController');
// const router = Router();

router.post('/register', UserRegister);
router.post('/login', login);
router.post('/logout', logout);

router.get('/profile/:id', getUserById);

router.get('/users', getAllUsers);

module.exports = router;