const mongoose = require('mongoose');
const validator= require('validator');
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
  password: {
    type: String,
    required: [true, 'Please Enter Your Password'],
    minlength: [8, 'Password should be greater than 8 characters'],
    // select: false
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
    }
  },
});
userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
})
const User = mongoose.model('User', userSchema);
module.exports = User