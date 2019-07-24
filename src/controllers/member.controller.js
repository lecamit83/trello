const MemberServices = require('../services/member.service');

async function addMemberIntoBoard(req, res) {
  try {
    const board = req.board, email = req.body.email;  
    const board = await MemberServices.addMemberIntoBoard(board, email);
    res.status(200).send({message : 'Invite Member Success!', board})
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message})
  }
}

async function addMemberIntoCard(req, res) {
  try {
    const { board, card } = req, email = req.body.email;  
    const card = await MemberServices.addMemberIntoCard(board, card, email);
    res.status(200).send({message : 'Add member into Card Success'})
  } catch (error) {
    res.status(error.statusCode|| 500).send({message : error.message})
  }
}
async function removeMemberInCard(req, res) {
  try {
    const card = req.card, userId = req.params.userId;
    const mCard = await MemberServices.removeMemberInCard(card, userId);
    res.status(204).send({message : 'Remove member in card success!'})
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message})
  }
}

async function removeMemberInBoard(req, res) {
  try {
    const board = req.board, userId = req.params.userId;  
    await MemberServices.removeMemberInBoard(board, userId);
    res.status(200).send({message : 'Remove User Success!'})
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message})
  }
}

async function updatePermission(req, res, next) {
  try {
    const board = req.board,
          userId = req.params.userId,
          permission = req.body.permission === 'admin';
    await MemberServices.updateMemberPermission(board, userId, permission);
    res.status(200).send({message: 'User\'s permission was update!'})
  } catch (error) {
    res.status(error.statusCode).send({message : error.message})
  }
}

module.exports = {
  addMemberIntoBoard,
  removeMemberInBoard,
  updatePermission,
  addMemberIntoCard,
  removeMemberInCard
}
