const Sequelize = require('sequelize');

module.exports = class Reserve extends Sequelize.Model{
    static init(sequelize){
        return super.init({
			
            shopId: {
                type: Sequelize.INTEGER(200)
            },
            noDate: {
                type: Sequelize.DATE(6)
            },
		}, {
            sequelize,
            timestamps: false,
            modelName: 'Reserve',
            tableName: 'Reserves',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        db.Reserve.belongsTo(db.Shop, {foreignKey: 'shopId', targetKey: 'id'});
    }
};