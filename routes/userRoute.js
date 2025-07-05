const express = require('express');
const router = express.Router();
const { UserRegister, login,logout, getUserById, getAllUsers, updateUser, useractivitylogpost,userActivityById,allUserActiviyLog} = require('../controllers/userController');
// const router = Router();

router.post('/register', UserRegister);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile/:id', getUserById);
router.get('/users', getAllUsers);
router.put('/profile/:id', updateUser);
// user Activity log
router.post('/useractivity',useractivitylogpost)
router.get('/alluseractivity',allUserActiviyLog)
router.get('/useractivity/:userid',userActivityById)

module.exports = router;