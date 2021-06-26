const { Schema, model } = require("mongoose");
const crypto = require("crypto-extra");
/**
 * @description user schema
 */

const userSchema = new Schema(
  {
    role: {
      type: String,
      default: "user",
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    DOB: {
      type: String,
    },
    package: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    gender: {
      type: String,
    },
    position: {
      type: String,
    },
    securedanswer: {
      type: String,
    },
    securedquestion: {
      type: String,
    },
    sponsors_fullname: {
      type: String,
    },
    sponsors_username: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    secured_question: {
      type: String,
    },
    secured_answer: {
      type: String,
    },
    paymentProof: {
      type: Object,
    },
    bankdets: {
      type: Object,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    downlines: [
      {
        type: Object,
      },
    ],
    payouts: [
      {
        type: Object,
      },
    ],
    fooditems: [
      {
        type: Object,
      },
    ],
    approved: {
      type: Boolean,
      default: false,
    },
    approvedState: {
      type: String,
      default: "pending",
    },
    pv: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    requestWithdrawal:{
      type:Boolean,
      default:false
    },
    userPaidHistory:[
      {
        type:Object
      }
    ],
    userPaidHistoryFood:[
      {
        type:Object
      }
    ],
    userPaid:{
      type:Boolean,
      default:false
    },
    withdrawals:[
      {
        type:Object
      }
    ],
    requestWithdrawalFood:{
      type:Boolean,
      default:false
    },
    userGivenFood:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomString().toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};
module.exports = model("user", userSchema);
