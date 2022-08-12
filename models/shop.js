const Sequelize = require('sequelize');

module.exports = class Shop extends Sequelize.Model{
    static init(sequelize){
        return super.init({
			
            shopName: {
                type: Sequelize.STRING(500)
            },
            intro: {
                type: Sequelize.STRING(500)
            },
            workTime: {
                type: Sequelize.STRING(200)
            },
            workHoly: {
                type: Sequelize.STRING(200)
            },
            shopNum: {
                type: Sequelize.STRING(500)
            },
            workName: {
                type: Sequelize.STRING(500)
            },
            address: {
                type: Sequelize.STRING(500)
            },
            parking: {
                type: Sequelize.STRING(500)
            },
            shopImg: {
                type: Sequelize.STRING(500)
            },
            userId: {
                type: Sequelize.INTEGER(200)
            },
            coordinateX: {
                type: Sequelize.FLOAT(50)
            },
            coordinateY: {
                type: Sequelize.FLOAT(50)
            }
		}, {
            sequelize,
            timestamps: false,
            modelName: 'Shop',
            tableName: 'Shops',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        db.Shop.belongsTo(db.User, {foreignKey: 'userId', targetKey: 'id'});
        db.Shop.hasMany(db.Order, {foreignKey: 'shopId', sourceKey: 'id'});
        db.Shop.hasMany(db.Reserve, {foreignKey: 'shopId', sourceKey: 'id'});
        db.Shop.hasMany(db.Service, {foreignKey: 'shopId', sourceKey: 'id'});
    }
};