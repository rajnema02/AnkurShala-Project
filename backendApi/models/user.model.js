const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
  },
  mobile: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: mongoose.Types.ObjectId,
    ref: "Role",
  },
  // Student Specific Fields Start
  mothers_name: {
    type: String,
    default: '',
  },
  fathers_name: {
    type: String,
    default: '',
  },
  school_name: {
    type: String,
    default: '',
  },
  // Student Specific Fields End
  // Teacher Specific Fields Start
  preferred_subject: {
    type: String,
    default: '',
  },
  manageable_subject: {
    type: String,
    default: '',
  },
  highest_qualification: {
    type: String,
    default: '',
  },
  // Teacher Specific Fields End
  board_name: {
    type: String,
    default: '',
  },
  dob: {
    type: Date
  },
  tags: {
    type: Array,
    default: []
  },
  notes: {
    type: String,
    default: ''
  },
  wishlist: {
    type: Array,
    default: []
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  is_inactive: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: mongoose.Types.ObjectId,
  },
  topUser: {
    type: mongoose.Types.ObjectId,
  },
  updated_at: {
    type: Date,
  },
  deleted_at: {
    type: Date,
  },
  restored_at: {
    type: Date,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      if (this.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.pre("updateOne", async function (next) {
  try {
    let query = this;
    let update = query.getUpdate();
    if (update.$set.otp) {
      const salt = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(update.$set.otp, salt);
      update.$set.otp = hashedOtp;
    }
    if (update.$set.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(update.$set.password, salt);
      update.$set.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
    // return password == this.password
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
