const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
			
            user_name: {
                type: Sequelize.STRING(500)
            },
            password: {
                type: Sequelize.STRING(500)
            },
            phone_num: {
                type: Sequelize.STRING(500)
            },
            email: {
                type: Sequelize.STRING(500)
            },
            img: {
                type: Sequelize.STRING(500)
            },
            isowner: {
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
        db.User.hasMany(db.Pet, {foreignKey: 'user_id', targetKey: 'id'});
        db.User.hasMany(db.Shop, {foreignKey: 'user_id', targetKey: 'id'});
    }
};