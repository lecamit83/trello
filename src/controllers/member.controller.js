const MemberServices = require('../services/member.service');

function addMemberIntoBoard(req, res) {
  let board = req.board, email = req.body.email;

  MemberServices.addMemberIntoBoard(board, email)
  .then((board) => res.status(200).send({message : 'Invite Member Success!', board}))
  .catch((error) => res.status(error.statusCode || 500).send({message : error.message}));
}

function addMemberIntoCard(req, res) {
  let { board, card } = req, email = req.body.email;

  MemberServices.addMemberIntoCard(board, card, email)
  .then(() => res.status(200).send({message : 'Add member into Card Success'}))
  .catch(error => res.status(error.statusCode|| 500).send({message : error.message}));
}
function removeMemberInCard(req, res, next) {
  let card = req.card, userId = req.params.userId;
  
  MemberServices.removeMemberInCard(card, userId)
  .then(card => res.status(204).send({message : 'Remove member in card success!'}))
  .catch(error => res.status(error.statusCode || 500).send({message : error.message}));
}

function removeMemberInBoard(req, res) {
  let board = req.board, userId = req.params.userId;

  MemberServices.removeMemberInBoard(board, userId)
  .then(()=>res.status(200).send({message : 'Remove User Success!'}))
  .catch(error => res.status(error.statusCode || 500).send({message : error.message}));
}

function updatePermission(req, res, next) {
  let board = req.board,
      userId = req.params.userId,
      permission = req.body.permission === 'admin';
  
  MemberServices.updateMemberPermission(board, userId, permission)
  .then(()=> res.status(200).send({message: 'User\'s permission was update!'}))
  .catch(error => res.status(error.statusCode).send({message : error.message}));
}

module.exports = {
  addMemberIntoBoard,
  removeMemberInBoard,
  updatePermission,
  addMemberIntoCard,
  removeMemberInCard
}
