const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter Your Name'],
    // maxlength: [30, 'Name cannot exceed 30 characters'],
    // minlength: [4, 'Name should have more than 4 characters']
  },
  email: {
    type: String,
    required: [true, 'Please Enter Your Email'],
    unique: true,
    lowecase: true,
    validate: [validator.isEmail, 'Please Enter a valid Email'],
  },
  photo: {
    type: String,
    // default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please Enter Your Password'],
    minlength: [8, 'Password should be greater than 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Confirm Your Password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Hash the password with cost of 12
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now()-1000;
  
  next(); 
});
// Check if password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if password was changed after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // eslint-disable-next-line radix
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  // false means not changed
  return false;
};

// Create password reset token
userSchema.methods.createPasswordResetToken = function () {
  // Generate random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  // Hash the token and set to resetPasswordToken field
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // token expires in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
