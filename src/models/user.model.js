const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const Schema = mongoose.Schema;
const SALT_ROUND = 10;
const NotFound = require('../errors/NotFoundError');
const APIError = require('../errors/APIError');

const userSchema = new Schema({
  name : {
    type : String,
  },
  email : {
    type : String,
  },
  password : {
    type : String,
  },
  avatar : {
    type : String,
  },
  tokens : [{
    token: {
      type : String
    }
  }],
  boards : [{
    boardId: {
      type : Schema.Types.ObjectId,
      ref : 'Board'
    }
  }]
}, {
  timestamps : true,
});

userSchema.methods.toJSON = function() {
  const user = this;
  let obj = user.toObject();
  delete obj.tokens;
  delete obj.password;
  delete obj.__v;
  return obj;
}

userSchema.methods.generateToken = async function() {
  const user = this;
  let token = await JWT.sign({ _id : user._id.toString() }, process.env.SECRET_KEY_JWT);
  user.tokens = user.tokens.concat({ token });

  return token;
};

userSchema.statics.findByBoardId = function(boardId) {
  return User.find({'boards.boardId': boardId });
}

userSchema.statics.findByCredentials = async function(email, password) {
  const user = await User.findOne({ email }).orFail(new APIError('Email Incorrect!', 422)).exec();
  const isMatch = await bcrypt.compare(password, user.password);
  if( !isMatch ) {
    throw new APIError('Password incorrect', 422);
  }
  return user;
}

userSchema.pre('save', async function(next) {
  const user = this;
  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password ,SALT_ROUND);
  }
  next();
});


const User = mongoose.model('User', userSchema);
module.exports = User;
