const express = require('express');
const router = express.Router();

const userRoute = require('./user.route');
const boardRoute = require('./board.route');
const memberRoute = require('./member.route');
const listRoute = require('./list.route');

router.use('/users', userRoute);
router.use('/boards', boardRoute);
router.use('/members', memberRoute);
router.use('/lists', listRoute);

module.exports = router;
