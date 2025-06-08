const express = require('express');
const router = express.Router();
const { UserRegister, login,logout, getUserById, getAllUsers, updateUser} = require('../controllers/userController');
// const router = Router();

router.post('/register', UserRegister);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile/:id', getUserById);
router.get('/users', getAllUsers);
router.put('/profile/:id', updateUser);

module.exports = router;