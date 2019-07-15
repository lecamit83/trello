const express = require('express');
const router = express.Router();

const userRoute = require('./user.route');
const boardRoute = require('./board.route');
const memberRoute = require('./member.route');
const listRoute = require('./list.route');
const cardRoute = require('./card.route');

router.use('/users', userRoute);
router.use('/boards', boardRoute);
router.use('/members', memberRoute);
router.use('/lists', listRoute);
router.use('/cards', cardRoute);

module.exports = router;
