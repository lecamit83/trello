const express = require('express');
const router = express.Router();

const userRoute = require('./user.route');
const boardRoute = require('./board.route');

router.use('/users', userRoute);
router.use('/boards', boardRoute);

module.exports = router;
