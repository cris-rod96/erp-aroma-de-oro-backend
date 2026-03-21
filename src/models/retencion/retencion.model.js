import { DataTypes } from 'sequelize'

const RetencionModel = (sq) => {
  sq.define(
    'Retencion',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      porcentajeRetencion: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      valorRetenido: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      LiquidacionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Liquidaciones',
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
      tableName: 'Retenciones',
    }
  )
}

export default RetencionModel
