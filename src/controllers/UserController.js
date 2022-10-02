var User = require("../models/User");

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
}

module.exports = new UserController();
