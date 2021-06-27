const Admin = require("../../models/admin.models");
const User = require("../../models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const { APPSECRET } = require("../../config");

exports.register = (req, res) => {
  const {
    email,
    password,
    phone_number,
    first_name,
    last_name,
    DOB,
    username,
  } = req.body;
  Admin.findOne({ email }, (err, admin) => {
    if (err) {
      res.status(400).json({
        message: "an error occured",
        error: err,
      });
    }
    if (admin) {
      res.status(403).json({
        message: `email already exist`,
      });
    }
    if (!admin) {
      const hash = bcrypt.hashSync(password, 10);
      const newAdmin = new Admin({
        email,
        phone_number,
        first_name,
        last_name,
        DOB,
        username,
        password: hash,
      });
      newAdmin
        .save()
        .then((newadmin) => {
          res.status(201).json({
            message: "account created successfully",
            admin: {
              id: newadmin._id,
            },
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  Admin.findOne({ email }, (err, admin) => {
    if (err) {
      return res.status(400).json({
        message: "an error occured ",
      });
    }
    if (!admin) {
      return res.status(404).json({
        message: "account does not exist",
      });
    }
    if (admin) {
      let isPasswordValid = bcrypt.compareSync(password, admin.password);
      if (isPasswordValid) {
        let token = jwt.sign(
          {
            data: { id: admin._id, role: admin.role },
          },
          APPSECRET
        );
        res.status(200).json({
          token,
          message: "login successful",
          admin: {
            _id: admin._id,
            role: admin.role,
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

exports.adminProfile2 = (req, res) => {
  Admin.findOne({ _id: req.user.data.id })
    .then((admin) => {
      res.status(200).json({
        admin,
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

exports.pendingUsers = (req, res) => {
  User.find({ approved: false, approvedState: "pending" })
    .then((result) => {
      res.status(200).json({
        status: true,
        result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: false,
        err,
      });
    });
};
exports.getdeclinedUsers = (req, res) => {
  User.find({ approved: false, approvedState: "declined" })
    .then((result) => {
      res.status(200).json({
        status: true,
        result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: false,
        err,
      });
    });
};
exports.approveUser = (req, res) => {
  User.findOne({ _id: req.params.id }, (err, mainuser) => {
    if (err) {
      return res.status(400).json({
        message: "an error occured",
        status: false,
      });
    }
    if (mainuser) {
      if (mainuser.sponsors_username) {
        User.findOne({ username: mainuser.sponsors_username }, (err, user) => {
          if (err) {
            return res.status(400).json({
              status: false,
              message: "an error occured",
            });
          }
          if (user) {
            user.downlines.push({
              first_name: mainuser.first_name,
              last_name: mainuser.last_name,
              username: mainuser.username,
              date: new Date(),
            });
            switch (user.downlines.length) {
              case 2:
                user.fooditems.push({
                  total: 5000,
                  name: "level 1 food items",
                  status: "false",
                  id: uuidv4(),
                  items: [
                    "4 PACKS OF SPAHETTI",
                    "350g MILK",
                    "450g MILO",
                    "1 PACK OF MAGGI CUBES",
                  ],
                });
                break;
              case 4:
                user.pv = user.pv + 5000;
                user.payouts.push({
                  name: "level 2 cash earning",
                  amount: 5000,
                  status: "false",
                  id: uuidv4(),
                });
                user.fooditems.push({
                  total: 5000,
                  status: "false",
                  name: "level 2 food items",
                  id: uuidv4(),
                  items: [
                    "6 PACKS OF SPAHETTI",
                    "1 PACK OF MAGGI CUBES",
                    "2 SARDINS",
                    "500g  GOLDEN MORN",
                    "350g  GOLDEN MORN",
                  ],
                });
                break;
              case 8:
                user.pv = user.pv + 20000;
                user.fooditems.push({
                  total: 20000,
                  name: "level 3 food items",
                  status: "false",
                  id: uuidv4(),
                  items: [
                    "2 PACK OF MAGGI CUBES",
                    "3LTR OF POWER OIL",
                    "1 CARTON OF NOODLES",
                    "1 DOZEN OF SPAHETTI",
                    "3 SARDINES",
                    "500g GOLDEN MORN",
                    "1500g MILO",
                    "1 DANO MILK",
                    "1 PACK OF SALT",
                  ],
                });
                user.payouts.push({
                  name: "level 3 cash earning",
                  amount: 20000,
                  status: "false",
                  id: uuidv4(),
                });
                break;
              case 16:
                user.pv = user.pv + 100000;
                user.fooditems.push({
                  total: 40000,
                  name: "level 4 food items",
                  status: "false",
                  id: uuidv4(),
                  items: [
                    "25kgBAG OF RICE",
                    "5 LITRES OF VEGETABLE OIL",
                    "6 TINS OF TOMATO PASTE",
                    "1 MILO",
                    "1 DANO MILK",
                    "1 GOLDEN MORN",
                  ],
                });
                user.payouts.push({
                  name: "level 4 cash earning",
                  amount: 100000,
                  status: "false",
                  id: uuidv4(),
                });
                break;
              case 32:
                user.pv = user.pv + 150000;
                user.fooditems.push({
                  total: 100000,
                  name: "level 5 food items",
                  status: "false",
                  id: uuidv4(),
                  items: [
                    "1 BAG OF RICE",
                    "5 LITRES OF VEGETABLE OIL ",
                    "1 CARTON OF TOMATOES",
                    "12 TINS OF GEISHA",
                    "12 TINS OF SARDINES",
                    "2 DANO MILK",
                    "2 MILO",
                    "2 GOLDEN MORN",
                    "2 CORN FLAKES",
                    "BEANS",
                  ],
                });
                user.payouts.push({
                  name: "level 5 cash earning",
                  amount: 150000,
                  status: "false",
                  id: uuidv4(),
                });
                break;
              default:
            }
            user.approved = true;
            user.approvedState = "approved";
            mainuser.approved = true;
            mainuser.approvedState = "approved";
            mainuser.save();
            user.save().then(() => {
              res.status(200).json({
                message: "updated successfully",
                status: true,
              });
            });
          }
        });
      } else {
        user.approved = true;
        user.approvedState = "approved";
        mainuser.approved = true;
        mainuser.approvedState = "approved";
        mainuser.save();
        user.save().then(() => {
          res.status(200).json({
            message: "updated successfully",
            status: true,
          });
        });
      }
    } else {
      return res.status(400).json({
        message: "user not found",
        status: false,
      });
    }
  });
};
exports.declineUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    { approved: false, approvedState: "declined" },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          message: "an error occured",
          status: false,
        });
      }
      if (user) {
        return res.status(200).json({
          message: "declined successfully",
          status: true,
        });
      } else {
        return res.status(400).json({
          message: "user not found",
          status: false,
        });
      }
    }
  );
};

exports.claimPayout = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user.data.id, "payouts.id": req.body.id },
    { $set: { "payouts.$.status": "requested" } },
    (err, result) => {
      if (err) {
        return res.status(400).json({ message: "an error occured" });
      }
      if (result) {
        result.pv += parseInt(req.body.amount);
        result.save().then(() => {
          res.status(200).json({
            message: "successfully claimed",
          });
        });
      }
    }
  );
};
exports.claimFooditems = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user.data.id, "fooditems.id": req.body.id },
    { $set: { "fooditems.$.status": "requested" } },
    (err, result) => {
      if (err) {
        return res.status(400).json({ message: "an error occured" });
      }
      if (result) {
        result.save().then(() => {
          res.status(200).json({
            message: "successfully claimed",
          });
        });
      }
    }
  );
};

exports.changeLevel = (req, res) => {
  User.findOne({ _id: req.user.data.id })
    .then((user) => {
      if (user.level == 0 && req.body.leveldownlines == 2) {
        user.fooditems.push({
          total: 5000,
          name: "level 1 food items",
          status: "false",
          id: uuidv4(),
          items: [
            "4 PACKS OF SPAHETTI",
            "350g MILK",
            "450g MILO",
            "1 PACK OF MAGGI CUBES",
          ],
        });
        user.level = 1;
        user.save().then(() => {
          return res.status(200).json({
            status: true,
          });
        });
      }
      if (user.level == 1 && req.body.leveldownlines == 4) {
        user.payouts.push({
          name: "level 2 cash earning",
          amount: 5000,
          status: "false",
          id: uuidv4(),
        });
        user.fooditems.push({
          total: 5000,
          status: "false",
          name: "level 2 food items",
          id: uuidv4(),
          items: [
            "6 PACKS OF SPAHETTI",
            "1 PACK OF MAGGI CUBES",
            "2 SARDINS",
            "500g  GOLDEN MORN",
            "350g  GOLDEN MORN",
          ],
        });
        user.level = 2;
        user.save().then(() => {
          return res.status(200).json({
            status: true,
          });
        });
      }
      if (user.level == 2 && req.body.leveldownlines == 8) {
        user.fooditems.push({
          total: 20000,
          name: "level 3 food items",
          status: "false",
          id: uuidv4(),
          items: [
            "2 PACK OF MAGGI CUBES",
            "3LTR OF POWER OIL",
            "1 CARTON OF NOODLES",
            "1 DOZEN OF SPAHETTI",
            "3 SARDINES",
            "500g GOLDEN MORN",
            "1500g MILO",
            "1 DANO MILK",
            "1 PACK OF SALT",
          ],
        });
        user.payouts.push({
          name: "level 3 cash earning",
          amount: 20000,
          status: "false",
          id: uuidv4(),
        });
        user.level = 3;
        user.save().then(() => {
          return res.status(200).json({
            status: true,
          });
        });
      }
      if (user.level == 3 && req.body.leveldownlines == 16) {
        user.fooditems.push({
          total: 40000,
          name: "level 4 food items",
          status: "false",
          id: uuidv4(),
          items: [
            "25kgBAG OF RICE",
            "5 LITRES OF VEGETABLE OIL",
            "6 TINS OF TOMATO PASTE",
            "1 MILO",
            "1 DANO MILK",
            "1 GOLDEN MORN",
          ],
        });
        user.payouts.push({
          name: "level 4 cash earning",
          amount: 100000,
          status: "false",
          id: uuidv4(),
        });
        user.level = 4;
        user.save().then(() => {
          return res.status(200).json({
            status: true,
          });
        });
      }
      if (user.level == 4 && req.body.leveldownlines == 32) {
        user.fooditems.push({
          total: 100000,
          name: "level 5 food items",
          status: "false",
          id: uuidv4(),
          items: [
            "1 BAG OF RICE",
            "5 LITRES OF VEGETABLE OIL ",
            "1 CARTON OF TOMATOES",
            "12 TINS OF GEISHA",
            "12 TINS OF SARDINES",
            "2 DANO MILK",
            "2 MILO",
            "2 GOLDEN MORN",
            "2 CORN FLAKES",
            "BEANS",
          ],
        });
        user.payouts.push({
          name: "level 5 cash earning",
          amount: 150000,
          status: "false",
          id: uuidv4(),
        });
        user.level = 5;
        user.save().then(() => {
          return res.status(200).json({
            status: true,
          });
        });
      } else {
        return res.status(200).json({
          status: true,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: "an error occured",
      });
    });
};

exports.users = (req, res) => {
  User.find({})
  .sort({createdAt:-1})
    .then((users) => {
      res.status(200).json({
        users,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "an error occured",
      });
    });
};

exports.pendingusers = (req, res) => {
  User.find({ approvedState: "pending" })
    .then((users) => {
      res.status(200).json({
        users,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "an error occured",
      });
    });
};
exports.pendingpayouts = (req, res) => {
  User.find({ requestWithdrawal: true })
    .then((users) => {
      res.status(200).json({
        users,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "an error occured",
      });
    });
};
exports.pendingpayoutsfood = (req, res) => {
  User.find({ requestWithdrawalFood: true })
    .then((users) => {
      res.status(200).json({
        users,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "an error occured",
      });
    });
};

exports.payUser = (req, res) => {
  User.findOne({ _id: req.body.id })
    .then((user) => {
      user.userPaid = true;
      user.requestWithdrawal = false;
      user.userPaidHistory.push({
        fullName: `${user.first_name} ${user.last_name}`,
        username: user.username,
        amount: user.pv,
        id: user._id,
      });
      user.pv = 0;
      user.save().then(() => {
        return res.status(200).json({
          message: "updated successfully",
        });
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: "an error occured",
      });
    });
};
exports.payUserFood = (req, res) => {
  User.findOne({ _id: req.body.id })
    .then((user) => {
      user.userGivenFood = true;
      user.requestWithdrawalFood = false;
      user.userPaidHistoryFood.push({
        fullName: `${user.first_name} ${user.last_name}`,
        username: user.username,
        fooditems: user.fooditems,
        id: user._id,
      });
      user.save().then(() => {
        return res.status(200).json({
          message: "updated successfully",
        });
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: "an error occured",
      });
    });
};
exports.declinePayUser = (req, res) => {
  User.findOne({ _id: req.body.id })
    .then((user) => {
      user.requestWithdrawal = false;
      user.save().then(() => {
        return res.status(200).json({
          message: "updated successfully",
        });
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: "an error occured",
      });
    });
};

exports.paidUsers = (req, res) => {
  User.find({ userPaid: true })
    .then((result) => {
      let historys = [];
      result.map((user) => {
        user.userPaidHistory.map((history) => {
          historys.push(history);
        });
      });
      return res.status(200).json({
        historys,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        error: "an error occured",
      });
    });
};

exports.paidUsersFood = (req, res) => {
  User.find({ userGivenFood: true })
    .then((result) => {
      let historys = [];
      result.map((user) => {
        user.userPaidHistory.map((history) => {
          historys.push(history);
        });
      });
      return res.status(200).json({
        historys,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        error: "an error occured",
      });
    });
};