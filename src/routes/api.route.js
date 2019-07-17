const express = require('express');
const router = express.Router();

const userRoute = require('./user.route');
const boardRoute = require('./board.route');
const memberRoute = require('./member.route');
const listRoute = require('./list.route');
const cardRoute = require('./card.route');

router.use(userRoute);
router.use(boardRoute);
router.use(memberRoute);
router.use(listRoute);
router.use(cardRoute);

module.exports = router;
