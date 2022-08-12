const Sequelize = require('sequelize');

module.exports = class Service extends Sequelize.Model{
    static init(sequelize){
        return super.init({
			
            shopId: {
                type: Sequelize.INTEGER(200)
            },
            serviceName: {
                type: Sequelize.STRING(500)
            },
            amount: {
                type: Sequelize.INTEGER(200)
            }
		}, {
            sequelize,
            timestamps: false,
            modelName: 'Service',
            tableName: 'Services',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        db.Service.belongsTo(db.Shop, {foreignKey: 'shopId', targetKey: 'id'});
    }
};