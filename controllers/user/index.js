const User = require("../../models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { APPSECRET } = require("../../config");
var smtpTransport = require("nodemailer-smtp-transport");

function usernameChecker(username) {
    User.findOne({username},(err,user)=>{

      if(err){
        return false
      }
      if(user){
        return true
      }
    })
}
exports.register = (req, res) => {
  const {
    email,
    password,
    phone_number,
    first_name,
    last_name,
    DOB,
    username,
    package,
    position,
    securedanswer,
    securedquestion,
    sponsors_fullname,
    sponsors_username,
  } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      res.status(403).json({
        message: "email already exist",
        error: err,
      });
    }
    if (user) {
      res.status(403).json({
        message: `email already exist`,
      });
    }
    if (!user) {
      User.findOne({username},(err,user)=>{
        if(err){
          return res.status(400).json({
            message:'username already exist'
          })
        }
        if(user){
          return res.status(400).json({
            message:'username already exist'
          })
        }
        if(!user){
          const hash = bcrypt.hashSync(password, 10);
      if(sponsors_username){
        User.findOne({username:sponsors_username},(err,user)=>{
          if(user){
            if (err) {
              res.status(400).json({
                message: "an error occured",
              });
            }
            const newUser = new User({
              email,
              phone_number,
              first_name,
              last_name,
              DOB,
              username,
              package,
              position,
              securedanswer,
              securedquestion,
              sponsors_fullname,
              sponsors_username,
              password: hash,
            });
            newUser
              .save()
              .then((newuser) => {
                
                res.status(201).json({
                  message: "account created successfully",
                  user: {
                    id: newuser._id,
                  },
                });
              })
              .catch((err) => {
                res.status(400).json(err);
              });
          }else{
            return res.status(404).json({
              message:'sponsors username does not exist'
            })
          }
  
        })
      }
      else{
        const newUser = new User({
          email,
          phone_number,
          first_name,
          last_name,
          DOB,
          username,
          package,
          position,
          securedanswer,
          securedquestion,
          sponsors_fullname,
          sponsors_username,
          password: hash,
        });
        newUser
          .save()
          .then((newuser) => {
            res.status(201).json({
              message: "account created successfully",
              user: {
                id: newuser._id,
              },
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      }
        }
      })
      
      
    }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(400).json({
        message: "an error occured ",
      });
    }
    if (!user) {
      return res.status(404).json({
        message: "account does not exist",
      });
    }
    if (user) {
      let isPasswordValid = bcrypt.compareSync(password, user.password);
      if (isPasswordValid) {
        let token = jwt.sign(
          {
            data: { id: user._id, role: user.role },
          },
          APPSECRET
        );
        res.status(200).json({
          token,
          message: "login successful",
          user: {
            _id: user._id,
            role: user.role,
            email:user.email,
            paymentProof:user.paymentProof?user.paymentProof:null
          },
        });
      } else {
        res.status(400).json({
          message: "invalid password",
        });
      }
    }
  });
};

exports.userProfile = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      res.status(200).json({
        user,
        status: true,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
        status: false,
      });
    });
};
exports.userProfile2 = (req, res) => {
  User.findOne({ _id: req.user.data.id })
  .then((user) => {
    res.status(200).json({
      user,
      status: true,
    });
  })
  .catch((err) => {
    res.status(400).json({
      error: err,
      status: false,
    });
  });
};

exports.userProfile1 = (req, res) => {
  User.findOne({ username: req.params.username },(err,user)=>{
    if(err){
      res.status(400).json({
        error: err,
        status: false,
      });
    }
    if(user){
      res.status(200).json({
        user,
        status: true,
      });
    }
    if(!user){
      res.status(400).json({
        error: err,
        status: false,
      });
    }
  })
};
exports.makePayment = (req, res) => {
  const { name, price } = req.body;
  if(req.file){
    let proofimg = req.file.path;
    const paymentProof = { name, price, proofimg };
    User.findOne({ _id: req.params.id })
      .then((user) => {
        user.paymentProof = paymentProof;
        user.save().then(() => {
          res.status(200).json({
            message: "payment recieved",
            status: true,
          });
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "please attach proof of payment, e.g : image or PDF",
          status: false,
        });
      });
  }
  else{
    res.status(400).json({
      message: "please upload image",
      status: false,
    });
  }
};


exports.updatePersonalDets=(req,res)=>{
  const {first_name,last_name,gender,DOB}=req.body
  let data={
    first_name,last_name,gender,DOB
  }
  let file
  if(req.file){
    file=req.file.path;
    data={
      ...data,
      profilePic:file
    }
  }
    User.findOneAndUpdate({_id:req.user.data.id},data,(err,user)=>{
        if(err){
          return res.status(400).json({
            message:'personal details failed to update'
          })
        }
        else{
          return res.status(200).json({
            message:'profile details updated successfully'
          })
        }
    })
}
exports.updateBankDets=(req,res)=>{
  const {bank_name,account_name,account_number}=req.body
    User.findOneAndUpdate({_id:req.user.data.id},
      {bankdets:{bank_name,account_name,account_number}},(err,user)=>{
        if(err){
          return res.status(400).json({
            message:'bank details failed to update'
          })
        }
        else{
          return res.status(200).json({
            message:'bank details updated successfully'
          })
        }
    })
}

exports.updateContactDets=(req,res)=>{
  const {email,phone_number,address,city,country}=req.body
    User.findOneAndUpdate({_id:req.user.data.id},
      {email,phone_number,address,city,country},(err,user)=>{
        if(err){
          return res.status(400).json({
            message:'personal details failed to update'
          })
        }
        if(user){
          return res.status(200).json({
            message:'profile details updated successfully'
          })
        }
    })
}

exports.users=(req,res)=>{
  User.find({})
  .then((result) => {
    res.status(200).json({
      users:result,
      status:true
    })
  }).catch((err) => {
    res.status(200).json({
      err,
      status:false
    })
  });
}


exports.userDownlines = (req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      res.status(200).json({
        downlines:user.downlines,
        status: true,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
        status: false,
      });
    });
};

exports.resetpassword = (req, res) => {
  const { email, type } = req.body;
  if (type === "user") {
    User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: `The email address  +
            ${email}
             is not associated with any account. Double-check 
            your email address and try again.`,
        });
      }
      user.generatePasswordReset();

      user.save().then((user) => {
        let link =
          "http://" +
          req.headers.origin +
          req.body.path +"?token="+
          user.resetPasswordToken;

        sendmailtouser = async () => {
          const nodemailer = require("nodemailer");
          let transporter = nodemailer.createTransport(
            smtpTransport({
              host: "tummyfirstmart.com",
              port: 465,
              secure: true, // true for 465, false for other ports
              auth: {
                user: process.env.NODEMAILER_USERNAME, // generated ethereal user
                pass: process.env.NODEMAILER_PASSWORD, // generated ethereal password
              },
              connectionTimeout: 5 * 60 * 1000, // 5 min

              tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
              },
            })
          );

          let info = await transporter
            .sendMail({
              from: '"Tummyfirst" <hello@tummyfirstmart.com>', // sender address
              to: user.email,
              subject: "Password change request",
              text: `Hi ${user.first_name} \n 
          Please click on the following link ${link} to reset your password. \n\n 
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            })
            .then((response) => {
              res.send(response);
            })
            .catch((error) => {
              res.json({
                message: "error occured!",
                message1: error,
              });
            });
        };
        sendmailtouser();
      });
    });
  }
  if (type === "admin" || type === "superadmin") {
    Admin.findOne({ email }).then((user) => {
      if (!user) {
        return res.status(401).json({
          message: `The email address  +
            ${email}
             is not associated with any account. Double-check 
            your email address and try again.`,
        });
      }
      user.generatePasswordReset();
      user.save().then((user) => {
        let link =
          "http://" +
          req.body.host +
          req.body.path +"?token="+
          user.resetPasswordToken;

        sendmailtouser = async () => {
          const nodemailer = require("nodemailer");
          let transporter = nodemailer.createTransport(
            smtpTransport({
              host: "tummyfirstmart.com",
              port: 465,
              secure: true, // true for 465, false for other ports
              auth: {
                user: process.env.NODEMAILER_USERNAME, // generated ethereal user
                pass: process.env.NODEMAILER_PASSWORD, // generated ethereal password
              },
              connectionTimeout: 5 * 60 * 1000, // 5 min

              tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
              },
            })
          );

          let info = await transporter
            .sendMail({
              from: '"tummyfirst" <tummyfirstmart.com>', // sender address
              to: user.email,
              subject: "Password change request",
              text: `Hi ${user.first_name} \n 
          Please click on the following link ${link} to reset your password. \n\n 
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            })
            .then((response) => {
              res.status(200).json({
                message: "A reset email has been sent to " + user.email + ".",
                response,
              });
            })
            .catch((error) => {
              res.json({
                message: "error occured!",
                message1: error,
              });
            });
        };
        sendmailtouser();
      });
    });
  }
};

exports.reset = (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user){
        return res
          .status(401)
          .json({ message: "Password reset token is invalid or has expired." });
      }
      else{

        //Redirect user to form with the email address
        res.json(200).json({
            user
        })
      }

    })
    .catch((err) => res.status(500).json({ message: err.message }));
};


exports.resetPasswordChange = (req, res) => {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
        .then((user) => {
            const hashPassword =null
            if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});
            const hash = bcrypt.genSalt(10, function(err, salt) {
                if (err) 
                  return callback(err);
            
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                
                  //Set the new password
                  user.password = hash;
                  user.resetPasswordToken = undefined;
                  user.resetPasswordExpires = undefined;
      
                  // Save
                  user.save((err) => {
                      if (err) return res.status(500).json({message: err.message});
                      res.status(200).json({
                          message:`Successfully  reset password you can now login with new password`
                      })
                  });
                });
              });
        });
};

exports.requestWithdrawal=(req,res)=>{
  User.findOneAndUpdate({_id:req.user.data.id},{requestWithdrawal:true},(err,user)=>{
    if(err){
      return res.status(400).json({
        message:'an error occured'
      })
    }
    if(user){
      user.withdrawals.push({
        fullName:`${user.first_name} ${user.last_name}`,
        username:user.username,
        balance:user.pv,
        bankDetails:user.bankDetails,
        email:user.email,
        id:user._id,
      })
      user.save()
      .then(()=>{
        return res.status(200).json({
          message:'withdrawal request received successfully'
        })
      })
    }
    else{
      return res.status(404).json({
        message:'user not found'
      })
    }
  })

}
exports.requestWithdrawalFood=(req,res)=>{
  User.findOneAndUpdate({_id:req.user.data.id},{requestWithdrawalFood:true},(err,user)=>{
    if(err){
      return res.status(400).json({
        message:'an error occured'
      })
    }
    if(user){

      user.save()
      .then(()=>{
        return res.status(200).json({
          message:'withdrawal request received successfully'
        })
      })
    }
    else{
      return res.status(404).json({
        message:'user not found'
      })
    }
  })

}

