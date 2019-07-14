const Board = require('../models/board.model');
const Participant = require('../models/participant.model');
const { validateBoard } = require('../validations/board.validation');
async function verifyBoard(req, res, next) {
  try {
    const { errors, isValid, board } = validateBoard(req.body);
    if( !isValid ) {
      return res.status(400).send(errors);
    }
   
    let participants = new Participant({
      participants : [
        {
          personId : req.user._id,
          isAdmin : true
        }
      ]
    }) 
    
    await participants.save();
  
    req.board = { ...board, createdBy , partners : participants._id };
    next();  
  } catch (error) {
    next(error);
  }
}

async function verifyPermission(req, res, next) {
  try {
    let userId = req.user._id;
    let boardId = req.params.boardId;
    let board = await Board.findOne({_id : boardId});
    if(!board) {
      return res.status(404).send({message : 'Board Not Found'});
    }
   
    if(board.createdBy.toString() !== userId.toString()){
      return res.status(403).send({ message : 'Forbidden'})
    }

    let participant = await Participant.findOne({ _id : board.partners});
    if(!participant) {
      return res.status(500).send({message : 'Internal Error'});
    }
    req.board = board;
    req.participant = participant;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  verifyBoard,
  verifyPermission
}
