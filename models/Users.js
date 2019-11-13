const Sequelize = require('sequelize');
const db = require('../config/db');
const Projects = require('../models/Projects');
const bcrypt = require('bcrypt');

const Users = db.define('users', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Add a valid email'
            },
            notEmpty: {
                msg: 'Email field can not be blank'
            }
        },
        unique: {
            args: true,
            msg: 'This User already exist'
        }
    },
    password:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'password field can not be blank'
            }
        }
    },
    active:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiration: Sequelize.DATE
}, { 
    hooks: {
        beforeCreate(user){
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        }
    }
  }
);

// Personalized methods
Users.prototype.checkPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

Users.hasMany(Projects);

module.exports = Users;