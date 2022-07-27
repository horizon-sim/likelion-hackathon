const Sequelize = require('sequelize');

module.exports = class Pet extends Sequelize.Model{
    static init(sequelize){
        return super.init({
			
            user_id: {
                type: Sequelize.INTEGER(200)
            },
            dog_breed: {
                type: Sequelize.STRING(500)
            },
            age: {
                type: Sequelize.INTEGER(200)
            },
            pet_name: {
                type: Sequelize.STRING(500)
            },
            pet_img: {
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
        db.Pet.belongsTo(db.User, {foreignKey: 'user_id', targetKey: 'id'});
    }
};