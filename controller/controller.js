const { Sequelize, DataTypes } = require("sequelize");
const mysql = require("mysql2");
const dbName =
  process.env.STATUS === "development"
    ? "portofolio"
    : process.env.DATABASE_NAME;
const username =
  process.env.STATUS === "development"
    ? "root"
    : process.env.USERNAME;
const password =
  process.env.STATUS === "development"
    ? ""
    : process.env.PASSWORD;
const conn = new Sequelize(dbName, username, password, {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});
const Chat = conn.define(
  "chat",
  {
    chat: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    paranoid: true,
  }
);

const User = conn.define(
  "user",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    getterMethods: {
      userSave() {
        const user = {
          name: this.name,
          id: this.id,
          email: this.email,
          username: this.username,
        };
        return user;
      },
    },
  }
);
const Broadcast = conn.define(
  "broadcast",
  {
    chat: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    paranoid: true,
  }
);

Broadcast.belongsTo(User, { as: "sender" });
Chat.belongsTo(User, { as: "sender" });
Chat.belongsTo(User, { as: "reciever" });

module.exports = { conn, Chat, User, Broadcast };
