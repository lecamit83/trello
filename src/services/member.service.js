const validator = require('validator');

const UserModel = require('../models/user.model');
const CardModel = require('../models/card.model');
const { isMember } = require('../utils');
const APIError = require('../errors/APIError');
const NotFound = require('../errors/NotFoundError');

async function addMemberIntoBoard(board, email) {

  if(!email || !validator.isEmail(email)) {
    throw new APIError('Email Invalid', 422);
  }

  let user = await UserModel.findOne({ email }).orFail(new NotFound('User Not Found!')).exec();
  
  if(isMember(board.members, user._id)) {
    throw new APIError('User Is Exist In Board!');
  }
  // insert userId in board and boardId in user
  board.members.push({ userId : user._id });  
  user.boards.push({ boardId : board._id });
  await board.save();
  await user.save();
  return board;
}

async function removeMemberInBoard(board, userId) {
  if(!isMember(board.members, userId)) {
    throw new APIError('User Not Found!');
  }
  // remove member in board
  board.members = board.members.filter(function(member) {
    return member.userId.toString() !== userId.toString();
  });

  const user = await UserModel.findById(userId).orFail(new NotFound('User Not Found'));
  const cards = await CardModel.find({'members.user' : userId});

  // remove boardId in this user
  user.boards = user.boards.filter(function(board) {
    return board.boardId.toString() !== board._id.toString();
  });
  // remove member in cards
  for (const card of cards) {
    card.members = card.members.filter(function(e) {
      return e.user.toString() !== userId.toString();
    });
    await card.save();
  }

  await user.save();
  await board.save();

  return board;
}

async function addMemberIntoCard(board, card, email) {

  if(!email || !validator.isEmail(email)) {
    throw new APIError('Email invalid!', 422);
  }

  const user = await UserModel.findOne({email}).orFail(new NotFound('User Not Found!')).exec();
  if(!isMember(board.members, user._id)) {
    throw new APIError('Member Isn\'t Exist In Board!');
  }
  // add member into card
  for (const member of card.members) {
    if(member.user.toString() ===  user._id.toString()) {
      throw new APIError('Member Is Exist In Card');
    }
  }
  card.members.push({user : user._id});
  await card.save();
  return card;
}

function removeMemberInCard(card, userId) {
  card.members = card.members.filter(function (e) {
    return e.user.toString() !== userId.toString();
  });
  return card.save();
}

async function updateMemberPermission(board, userId, permission) {
  if(!isMember(board.members, userId)) {
    throw new NotFound('User isn\'t in board');
  }
  // find and update permission member
  board.members = board.members.filter(function(member) {
    if(member.userId.toString() === userId.toString()) {
      member.isAdmin = permission;
    }
    return member;
  }); 
  return board.save();
}


module.exports = {
  addMemberIntoBoard,
  addMemberIntoCard,
  removeMemberInCard,
  removeMemberInBoard,
  updateMemberPermission,
}
