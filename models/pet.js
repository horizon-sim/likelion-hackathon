const Sequelize = require('sequelize');

module.exports = class Pet extends Sequelize.Model{
    static init(sequelize){
        return super.init({
			
            userId: {
                type: Sequelize.INTEGER(200)
            },
            dogBreed: {
                type: Sequelize.STRING(500)
            },
            age: {
                type: Sequelize.INTEGER(200)
            },
            petName: {
                type: Sequelize.STRING(500)
            },
            petImg: {
                type: Sequelize.STRING(500)
            },
            weight: {
                type: Sequelize.FLOAT(30)
            },
            note: {
                type: Sequelize.STRING(500)
            }
		}, {
            sequelize,
            timestamps: false,
            modelName: 'Pet',
            tableName: 'Pets',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        db.Pet.belongsTo(db.User, {foreignKey: 'userId', targetKey: 'id'});
    }
};