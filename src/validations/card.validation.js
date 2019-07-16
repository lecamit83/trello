const validator = require('validator');
const { formatTitle } = require('../utils');

function validateTitle(title) {
  let errors = [];
  if(validator.isEmpty(title)) {
    errors.push('Title is Empty!');
  }
  return errors;
}

function validate(obj) {
  let card = {
    title : '',
    comments : [],
    dueDate : {
      date : '',
      time : ''
    },
    description : '',
  };

  if(obj.title) { 
    card.title = formatTitle(obj.title);
  }
  if(obj.description) {
    card.description = obj.description;
  }
  if(obj.comment) {
    card.comments.push(obj.comment);
  }
  if(obj.dueTime) {
    let arr = obj.dueTime.split(/\s+/);
    card.dueDate.date = arr[0];
    card.dueDate.time = arr[1];
  }
  return card;
}

module.exports = {
  validate,
  validateTitle
}
