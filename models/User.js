var User = require("../models/User");

  class UserController {
    async index(req, res) {}

    async create(req, res) {
      var { email, name, password } = req.body;

      if (email == undefined || email == '') {
        res.status(400);
        res.json({ err: "Invalid email" });
        return;
      }

      if (name == undefined || name == '') {
        res.status(400);
        res.json({ err: "Invalid name" });
        return;
      }

      if (password == undefined || password == '') {
        res.status(400);
        res.json({ err: "Invalid password" });
        return;
      }

      var emailExists = await User.findMail(email);

      if (emailExists) {
        res.status(406);
        res.json({ err: "Email already registered" });
        return;
      }

      await User.new(email, password, name);

      res.status(200);
      res.send("DONE!");
    }
  };

  module.exports = new UserController();
  