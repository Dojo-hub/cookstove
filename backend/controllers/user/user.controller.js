const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../models/index");
const httpError = require("../../helpers/httpError");
const dotenv = require("dotenv");
dotenv.config();

const SALTROUNDS = 10;

const allUsers = async (req, res) => {
  try {
    const page = req.query.page || 0;
    const limit = 50;
    const users = await db.User.scope("withoutPassword").findAndCountAll({
      where: { isSuperuser: false },
      offset: page * limit,
      limit,
    });
    res.send({ users });
  } catch (error) {
    res.status(500).send();
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.scope("withoutPassword").findOne({
      where: { id },
    });
    res.send({ user });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!req.user.admin)
      throw new httpError("Only super admin can delete user", 403);
    const { id } = req.params;
    const user = await db.User.destroy({ where: { id } });
    res.send({ user });
  } catch (error) {
    if (error.name === "httpError")
      res.status(error.code).send({ message: error.message });
    else res.status(500).send();
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    delete req.body.createdAt;
    req.body.updatedAt = new Date();
    const user = await db.User.update(req.body, {
      where: { id },
    });
    res.status(201).send({ user });
  } catch (error) {
    res.status(500).send();
  }
};

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName)
      throw new httpError("Missing required field!", 400);
    const user = await db.User.findOne({
      where: { email },
    });

    if (user) {
      throw new httpError("User with same email already exists!", 400);
    }
    const passwordHash = await bcrypt.hash(password, SALTROUNDS);
    const payload = {
      ...req.body,
      password: passwordHash,
      isActive: true,
    };

    const newUser = await db.User.create(payload);
    const token = createToken({
      sub: newUser.id,
      email: newUser.email,
      iat: Date.now(),
      admin: newUser.isSuperuser,
    });
    delete newUser.dataValues.password;
    res.send({ user: newUser, token });
  } catch (error) {
    if (error.name === "httpError")
      res.status(error.code).send({ message: error.message });
    else res.status(500).send();
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) throw new httpError("Missing Required field", 400);
    const user = await db.User.findOne({
      where: { email },
      raw: true,
    });
    if (!user) {
      throw new httpError("Incorrect Email Id/Password", 400);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new httpError("Incorrect Email Id/Password", 400);
    }
    const token = createToken({
      sub: user.id,
      email: user.email,
      iat: Date.now(),
      admin: user.isSuperuser,
    });
    delete user.password;
    res.send({ user, token });
  } catch (error) {
    if (error.name === "httpError")
      res.status(error.code).send({ message: error.message });
    else res.status(500).send();
  }
};

const profile = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await db.User.scope("withoutPassword").findOne({
      where: { id },
      include: {
        model: db.Device,
        as: "devices",
      },
    });
    res.send({ user });
  } catch (error) {
    res.status(500).send();
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await db.User.findOne({
      where: { id },
    });

    const match = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!match) {
      throw new httpError("Old password is incorrect", 409);
    }

    const newPass = await bcrypt.hash(req.body.password, SALTROUNDS);
    await db.User.update(
      { password: newPass, updatedAt: new Date() },
      { where: { id: user.id } }
    );
    res.send({});
  } catch (error) {
    if (error.name === "httpError")
      res.status(error.code).send({ message: error.message });
    else res.status(500).send();
  }
};

const createToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET, { expiresIn: 15 * 60 });
};

module.exports = {
  login,
  register,
  changePassword,
  getUser,
  deleteUser,
  updateUser,
  allUsers,
  profile,
};
