// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_name: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    stock: {
      type: DataTypes.INTEGER,
      references: {
        model: 'traveller',
        key: 'id',
        unique: false
      }
    },
    Category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'location',
        key: 'id',
        unique: false
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;