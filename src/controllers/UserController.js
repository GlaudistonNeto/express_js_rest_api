var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");

var secret = "mK5(uH6#lU0+xJ9%";
const bcrypt = require("bcrypt");

class UserController {
  async index(req, res) {
    var users = await User.findAll();
    res.json(users);
  }

  async findUser(req, res) {
    var id = req.params.id;
    var user = await User.findById(id);

    if (user == undefined) {
      res.status(404);
      res.json({});
    } else {
      res.json(user);
    }
  }

  async create(req, res) {
    var {email, name, password} = req.body;

    if (email == undefined || email == '') {
      res.status(400);
      res.json({err: "Invalid email."});
      return;
    }

    if (name == undefined || name == '') {
      res.status(400);
      res.json({err: "Invalid name."});
      return;
    }

    if (password == undefined || password == '') {
      res.status(400);
      res.json({msg: "Invalid password."});
      return;
    }

    var emailExists = await User.findByEmail(email);

    if (emailExists) {
      res.status(406);
      res.json({err: "Email already registered."});
      return;
    }

    await User.new(email, password, name);

    res.send("All done!");
  }

  async edit(req, res) {
    var {id, name, role, email} = req.body;
    var result = await User.update(id, email, name, role);
    if (result != undefined) {
      if (result.status) {
        res.send("Okay!");
      } else {
        res.status(406);
        res.send(result.err);
      }
    } else {
        res.status(406);
        res.send("An error occurred on the server");
    }
  }

  async remove(req, res) {
    var id = req.params.id;

    var result = await User.delete(id);

    if (result.status) {
      res.send("Okay!");
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async recoverPassword(req, res) {
    var email = req.body.email;
    var result = await PasswordToken.create(email);
    if (result.status) {
      res.send("" + result.token);
    } else {
      res.status(406);
      res.send(res.err);
    }
  }
  async changePassword(req, res) {
    var token = req.body.token;
    var password = req.body.password;

    var isTokenValid = await PasswordToken.validate(token);

    if (isTokenValid.status) {
      await User.changePassword(password,
                                isTokenValid.token.user_id,
                                isTokenValid.token.token);
      
        res.send("Password changed successfully");
    } else {
      res.status(406);
      res.send("Invalid Token!");
    }
  }

  async login(req, res) {
    var email = req.body;

    var user = await User.findByEmail(email);

    if (user != undefined) {
      var result = await bcrypt.compare(password,
                                        req.body.user.password);

      if (result) {
        var token = jwt.sign({ email: user.email,
                               role: user.role },
                              secret);
        res.json({ token: token });
      } else {
        res.status(406);
        res.send("Wrong credentials!");
      }
    } else {
      res.json({ status: false });
    }
  }
}

module.exports = new UserController();



