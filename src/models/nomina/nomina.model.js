import { DataTypes } from 'sequelize'

const NominaModel = (sq) => {
  sq.define(
    'Nomina',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      fechaPago: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      diasTrabajados: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
      valorJornal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.0,
        },
      },
      subTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.0,
        },
      },

      bono: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.0,
        },
      },
      descuento: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
        validate: {
          min: 0.0,
        },
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.0,
        },
      },
      PersonaId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Personas',
          key: 'id',
        },
      },

      UsuarioId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
      tableName: 'Nominas',
    }
  )
}

export default NominaModel
