const Sequelize = require("sequelize");
const User = require("./user");  // 1
const Pet = require("./pet");
const Shop = require("./shop");
const Order = require("./order");
const Reserve = require("./reserve");
const Service = require("./service");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize( //config의 db정보와 연결
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;
db.Shop = Shop;
db.Pet = Pet;  // 2
db.Order = Order;
db.Reserve = Reserve;
db.Service = Service;

User.init(sequelize);  // 3
Pet.init(sequelize);
Shop.init(sequelize);
Order.init(sequelize);
Reserve.init(sequelize);
Service.init(sequelize);

User.associate(db);  // 4
Pet.associate(db);
Shop.associate(db);
Order.associate(db);
Reserve.associate(db);
Service.associate(db);

module.exports = db;

