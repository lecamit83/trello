const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const Schema = mongoose.Schema;
const SALT_ROUND = 10;

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

userSchema.statics.findByCredentials = function(email, password) {
  return User.findOne({ email }).exec()
  .then(function (user) {
    if(!user) {
      return Promise.reject({ statusCode : 422, message : 'Email Invalid!'});
    }
    return Promise.all([user, bcrypt.compare(password, user.password)]);
  })
  .then(function ([user, isMatch]) {
    if(!isMatch) {
      return Promise.reject({ statusCode : 422, message : 'Password Invalid!'});
    }
    return user;
  });
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
