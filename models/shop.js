const Sequelize = require('sequelize');

module.exports = class Shop extends Sequelize.Model{
    static init(sequelize){
        return super.init({
			
            shop_name: {
                type: Sequelize.STRING(500)
            },
            work_time: {
                type: Sequelize.STRING(200)
            },
            shop_num: {
                type: Sequelize.STRING(500)
            },
            designer_num: {
                type: Sequelize.INTEGER(200)
            },
            work_name: {
                type: Sequelize.STRING(500)
            },
            address: {
                type: Sequelize.STRING(500)
            },
            shop_img: {
                type: Sequelize.STRING(500)
            },
            user_id: {
                type: Sequelize.INTEGER(200)
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
        db.Shop.belongsTo(db.User, {foreignKey: 'user_id', targetKey: 'id'});
    }
};