const express = require('express');
const router = express.Router();

const userRoute = require('./user.route');
const boardRoute = require('./board.route');
const memberRoute = require('./member.route');

router.use('/users', userRoute);
router.use('/boards', boardRoute);
router.use('/members', memberRoute);


module.exports = router;
