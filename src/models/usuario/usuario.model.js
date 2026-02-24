import { DataTypes,Sequelize } from "sequelize";


const UsuarioModel = (sq) => {
    sq.define("Usuario", {
        id:{
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        nombresCompletos: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cedula: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type:DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        clave: {
            type: DataTypes.STRING,
            allowNull: false
        },
        esAdministrador: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        estaActivo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    })
}

export default UsuarioModel