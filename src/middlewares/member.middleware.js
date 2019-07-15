const Board = require('../models/board.model');
async function adminPermission(req, res, next) {
  try {
    let userId = req.user._id;
    let boardId = req.params.boardId;
    let board = await Board.findOne({_id : boardId});
    if(!board) {
      return res.status(404).send({message : 'Board Not Found'});
    }
   
    if(board.members[0].userId.toString() !== userId.toString() && !board.members[0].isAdmin){
      return res.status(403).send({ message : 'Forbidden'})
    }

    req.board = board;
    next();
  } catch (error) {
    next(error);
  }
}


module.exports = {
  adminPermission,
}
