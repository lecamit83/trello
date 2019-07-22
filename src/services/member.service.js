const validator = require('validator');

const UserModel = require('../models/user.model');
const CardModel = require('../models/card.model');
const { isMember } = require('../utils');

function addMemberIntoBoard(board, email) {
  email = email.trim();
  
  if(!validator.isEmail(email)) {
    return Promise.reject({ statusCode : 422, message : 'Email invalid!'});
  }

  return UserModel.findOne({ email }).exec()
  .then(function(user) {
    if(!user) {
      return Promise.reject({ statusCode : 404, message : 'User Not Found!'});
    }
    if(isMember(board.members, user._id)) {
      return Promise.reject({ statusCode : 400, message : 'User Is Exist In Board!'});
    }
    // insert userId in board and boardId in user
    board.members.push({ userId : user._id });  
    user.boards.push({ boardId : board._id });

    return Promise.all([board.save(), user.save()]);
  })
  .then(function([board, user]) {
    return board;
  });
}

function removeMemberInBoard(board, userId) {
  if(!isMember(board.members, userId)) {
    return Promise.reject({ statusCode : 404, message : 'User Not Found!'});
  }
  // remove member in board
  board.members = board.members.filter(function(member) {
    return member.userId.toString() !== userId.toString();
  });

  return Promise.all([UserModel.findById(userId), CardModel.find({'members.user' : userId})])
  .then(function([user, cards]) {
    // remove boardId in this user
    user.boards = user.boards.filter(function(board) {
      return board.boardId.toString() !== board._id.toString();
    });
    // remove all userId of user in card
    cards.forEach(async function(card){
      card.members = card.members.filter(function(e) {
        return e.user.toString() !== userId.toString();
      });
      await card.save();
    });
    
    return Promise.all([user.save(), board.save()]);
  });
}

function addMemberIntoCard(board, card, email) {
  email = email.trim();
  
  if(!validator.isEmail(email)) {
    return Promise.reject({ statusCode : 422, message : 'Email invalid!'});
  }

  return UserModel.find({ email }).exec()
  .then(function(user) {
    if(!user) {
      return Promise.reject({ statusCode : 404, message : 'User Not Found!'});
    }
    if(!isMember(board.members, user._id)) {
      return Promise.reject({ statusCode : 400, message : 'Member Isn\'t Exist In Board!'});
    }
    // add member into card
    card.members.push({user : user._id});

    return card.save();
  });
}

function removeMemberInCard(card, userId) {
  card.members = card.members.filter(function (e) {
    return e.user.toString() !== userId.toString();
  });
  return card.save();
}

function updateMemberPermission(board, userId, permission) {
  if(!isMember(board.members, userId)) {
    return Promise.reject({ statusCode : 404, message : 'User isn\'t in board'});
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
