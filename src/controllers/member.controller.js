const User = require('../models/user.model');
const { isMember, isOwner } = require('../utils');
async function inviteMember(req, res, next) {
  try {
    let email = req.body.email.trim();
    let user = await User.findOne({ email });
    if(!user) {
      return res.status(404).send({ message : 'User Not Found!'});
    }
    let board = req.board;
    console.log(user);
    
    if(isMember(board.members, user._id)) {
      return res.status(400).send({ message : 'Member is exist!'});
    }
 
    board.members.push({ userId : user._id });  
    user.boards.push({ boardId : board._id });

    await board.save();
    await user.save();
    res.status(200).send({ message : 'Invite Success!', board});
  } catch (error) {
    next(error);
  }
}

async function removeMember(req, res, next) {
  try {
    let board = req.board;
    let userId = req.params.userId;

    if(!isMember(board.members, userId)) {
      return res.status(400).send({ message : 'User NOT in Board' })
    }
    if(isOwner(board.members, userId)) {
      return res.status(403).send({ message : 'Cannot remove OWNER board!' })
    }
    
    board.members = board.members.filter(function(member) {
      return member.userId.toString() !== userId.toString();
    });
    
    let user = await User.findById(userId);
    user.boards = user.boards.filter(function(board) {
      return board.boardId.toString() !== req.params.boardId.toString();
    });
    await board.save();
    await user.save();
    res.status(200).send({message : 'User was removed!'});

  } catch (error) {
    console.log(error);
    
    next(error);
  }
}

async function updatePermission(req, res, next) {
  try {
    let board = req.board;
    let userId = req.params.userId;
    let permission = req.body.permission === 'admin';

    if(!isMember(board.members, userId)) {
      return res.status(400).send({ message : 'User NOT in Board' })
    }

    if(isOwner(board.members, userId)) {
      return res.status(403).send({message : 'Can\'t update permission owner board!'});
    }
    board.members = board.members.filter(function(member) {
      if(member.userId.toString() === userId.toString()) {
        member.isAdmin = permission;
      }
      return member;
    });
    
    await board.save();
    res.status(200).send({message : 'User was updated permission!'});

  } catch (error) {
    next(error);
  }
}

module.exports = {
  inviteMember,
  removeMember,
  updatePermission,
}