const mongoose = require('mongoose');
const validator = require('validator');
const mongoosePaginate = require('mongoose-paginate');

const userSchema = mongoose.Schema(
  {
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    identityNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(mongoosePaginate);

class User {
    static model (mongoConnection) {
        const user = mongoConnection.model('User', userSchema);
        return user;
    }
}

module.exports = User;