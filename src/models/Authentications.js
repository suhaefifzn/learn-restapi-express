const { DataTypes } = require("sequelize");
const { db } = require("../config/db");


const Authentications = db.define('Authentications', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
},
  {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

db.sync();

module.exports = { Authentications };