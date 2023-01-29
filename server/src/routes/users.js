const express = require('express')
const { authorization } = require('../middleware/authorization')

const router = express.Router();
const {
    getAllUsers,
    registerNewUser,
    getUserById,
    deleteUser
} = require('../controllers/users')

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/register', registerNewUser)
router.delete('/:id', authorization, deleteUser)

module.exports = router