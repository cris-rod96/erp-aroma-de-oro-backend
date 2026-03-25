import { DataTypes } from 'sequelize'

const UsuarioModel = (sq) => {
  sq.define(
    'Usuario',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      nombresCompletos: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cedula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      clave: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // CAMBIO AQUÍ: De Boolean a ENUM
      rol: {
        type: DataTypes.ENUM,
        values: ['Administrador', 'Contador', 'Estándar'],
        defaultValue: 'Estándar',
      },
      estaActivo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      tableName: 'Usuarios',
    }
  )
}

export default UsuarioModel
