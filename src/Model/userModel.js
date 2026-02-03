const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Platform ID
    userUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    //Info
    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },

    userPhoneNumber: {
      type: String,
    },

    userProfilePictureUrl: {
      type: String,
    },

    // Auth
    userPassword: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Platform control
    isActive: {
      type: Boolean,
      default: true,
    },

    // integrations: {
    //   whatsapp: {
    //     isConnected: Boolean,
    //     account: mongoose.Schema.ObjectId,
    //     ref: 'whatsAppAccountSchema',
    //   },
    //   instagram: {
    //     isConnected: Boolean,
    //     account: mongoose.Schema.ObjectId,
    //     ref: 'instagramAccountSchema',
    //   },
    //   facebook: {
    //     isConnected: Boolean,
    //     account: mongoose.Schema.ObjectId,
    //     ref: 'facebookAccountSchema',
    //   },
    // },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function () {
  if (!this.isModified('userPassword')) return;

  this.userPassword = await bcrypt.hash(this.userPassword, 12);
  console.log(`Password after hashing ${this.userPassword}`);
});

userSchema.pre('save', async function () {
  console.log('inside password change');

  if (!this.isModified('userPassword') || this.isNew) return;
  this.passwordChangedAt = Date.now() - 1000;
});

// 🔍 Compare passwords
userSchema.methods.verifyPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.userPassword);
};

module.exports = mongoose.model('User', userSchema);
