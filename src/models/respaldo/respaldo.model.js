import { DataTypes, Sequelize } from 'sequelize'

const RespaldoModel = (sq) => {
  sq.define(
    'Respaldo',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      nombreArchivo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      urlCloudinary: {
        type: DataTypes.TEXT, // Usamos TEXT porque las URLs pueden ser largas
        allowNull: false,
      },
      tamano: {
        type: DataTypes.STRING, // Ejemplo: "1.2 MB"
        allowNull: true,
      },
      estado: {
        type: DataTypes.ENUM('Exitoso', 'Fallido'),
        defaultValue: 'Exitoso',
      },
      CajaId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Relación con la caja que generó este backup al cerrar',
        references: {
          model: 'Cajas',
          key: 'id',
        },
      },
      fechaGeneracion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
      tableName: 'Respaldos',
    }
  )
}

export default RespaldoModel
