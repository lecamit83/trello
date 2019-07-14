const validator = require('validator');
const { formatTitle } = require('../utils');


function validateTitle(title) {
  let errors = [];
  if(validator.isEmpty(title)) {
    errors.push('Title is Empty!');
  }
  return errors;
}


function validateBoard(board) {
  board.title = formatTitle(board.title);
  let errors = [];
  errors.push(...validateTitle(board.title));
  
  let isValid = errors.length === 0;
  return {
    errors,
    isValid,
    board   
  };
}
module.exports = {
  validateBoard,
  formatTitle,
}
