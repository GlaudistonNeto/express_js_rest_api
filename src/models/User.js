const bcrypt = require("bcrypt");
const knex = require("../database/connection");
const PasswordToken = require("./PasswordToken");
const jwt = require("jsonwebtoken");
const secret = "kP5$pP8>dU4<lA0+bX7?vB3^fV3#hR9!";

// service

class User {
  async findAll(){
    try{
        var result = await knex.select(["id", "email", "role", "name"])
                               .table("users");
        return result;
    }catch(err){
        console.log(err);
        return [];
    }
  }

  async findById(id) {
    try{
      var result = await knex.select(["id", "email", "role", "name"])
                             .where({id: id}).table("users");
      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
  }catch(err){
      console.log(err);
      return undefined;
  }
  }

  async findByEmail(email) {
    try{
      var result = await knex.select(["id", "email", "role", "name"])
                             .where({email: email}).table("users");
      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
  }catch(err){
      console.log(err);
      return undefined;
  }
  }

  async new (email, password, name) {
    try {

      var salt = bcrypt.genSaltSync(10);
      var hash = await bcrypt.hash(password, salt);
      await knex.insert({email, password: hash, name, role: 0}).table("users");
    } catch (err) {
      console.log(err);
    }
  }

  async findByEmail(email) {
    try {
      var result = await knex.select("*")
                             .where({email: email})
                             .table("users");
      
      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async update(id, email, name, role) {
    var user = await this.findById(id);

    if (user != undefined) {
      var editUser = {};

      if (email != undefined) {
        if (email != user.email) {
          var result = await this.findByEmail(email);
          if (result == false) {
            editUser.email = email;
          } else {
            return { status: false, msg: "User email already registered." };
          }
        }
      }

      if (name != undefined) {
        editUser.name = name;
      }

      if (role != undefined) {
        editUser.role = role;
      }

      try {
        await knex.update(editUser).where({ id: id }).table("users");
        return ({ status: true });
      } catch (err) {
        return ({ status: false, err });
      }
    } else {
      return ({ status: false, err: "User does not exist." });
    }
  }

  async delete(id) {
    var user = await this.findById(id);

    if (user != undefined) {
      try {
        await knex.delete().where({id: id}).table("users");
        return {status: true}
      } catch (err) {
        return {status: false, err: err}
      }
    } else {
      return {status: false, err: "This user does not exist. It cannot be deleted."}
    }
  }

  async changePassword(newPassword, id, token) {
    var hash = await bcrypt.hash(newPassword, 10);
    await knex.update({ password: hash })
              .where({ id: id })
              .table("users");
    await PasswordToken.setUsed(token);
  }
}

module.exports = new User();