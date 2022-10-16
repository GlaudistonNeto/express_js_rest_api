var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");

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
      res.json({msg: "Invalid email."});
    }

    if (name == undefined || name == '') {
      res.status(400);
      res.json({msg: "Invalid name."});
    }

    if (password == undefined || password == '') {
      res.status(400);
      res.json({msg: "Invalid password."});
      return;
    }

    var emailExists = await User.findEmail(email);

    if (emailExists) {
      res.status(406);
      res.json({err: "Email already registered."});
      return;
    }

    await User.new(email, password, name);

    res.status(200);
    res.send("All done!");
  }

  async edit(req, res) {
    var {id, name, role, email} = req.body;
    var result = await User.update(id, email, name, role);
    if (result != undefined) {
      if (result.status) {
        res.status(200);
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
      res.status(200);
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
}

module.exports = new UserController();
