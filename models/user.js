const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
			
            userName: {
                type: Sequelize.STRING(500)
            },
            password: {
                type: Sequelize.STRING(500)
            },
            phoneNum: {
                type: Sequelize.STRING(500)
            },
            email: {
                type: Sequelize.STRING(500)
            },
            img: {
                type: Sequelize.STRING(500)
            },
            isOwner: {
                type: Sequelize.BOOLEAN(1)
            }
		}, {
            sequelize,
            timestamps: false,
            modelName: 'User',
            tableName: 'Users',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        db.User.hasMany(db.Pet, {foreignKey: 'userId', sourceKey: 'id'});
        db.User.hasMany(db.Shop, {foreignKey: 'userId', sourceKey: 'id'});
        db.User.hasMany(db.Order, {foreignKey: 'userId', sourceKey: 'id'});
    }
};