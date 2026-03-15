import { DataTypes, Sequelize } from 'sequelize'

const DetalleLiquidacionModel = (sq) => {
  sq.define(
    'DetalleLiquidacion',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      descripcionProducto: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      calificacion: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      porcentajeIVa: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      unidad: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['Quintales', 'Kilogramos', 'Libras', 'Unidades'],
      },

      cantidad: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      prima: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },

      parcial: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      ProductoId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Productos',
          key: 'id',
        },
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
      timestamps: false,
      tableName: 'DetalleLiquidaciones',
    }
  )
}

export default DetalleLiquidacionModel
