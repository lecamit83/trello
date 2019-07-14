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
  }]
}, {
  timestamps : true,
});

userSchema.methods.toJSON = function() {
  const user = this;
  let obj = user.toObject();
  delete obj.tokens;
  delete obj.password;
  delete obj._v;
  return obj;
}

userSchema.methods.generateToken = async function() {
  const user = this;
  
  let token = await JWT.sign({ _id : user._id.toString() }, process.env.SECRET_KEY_JWT);
  user.tokens = user.tokens.concat({ token });

  return token;
};

userSchema.statics.findByCredentials = async function(email, password) {
  let error = {};
  const user = await User.findOne({ email });
  if(!user) {
    error = {
      message : 'User Not Found!',
      code : 404,
    }
    return { user , error};
  }
  const isMatchPassword = await bcrypt.compare(password, user.password);
  if(!isMatchPassword) {
    error = {
      message : 'Password incorrect!',
      code : 400,
    }
    return { user , error};
  }
  return {user, error};
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
