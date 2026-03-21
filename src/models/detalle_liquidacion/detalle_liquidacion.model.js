import { DataTypes } from 'sequelize'

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
        type: DataTypes.STRING, // Cambiado a STRING por si usan letras (A, B, C) o números
        allowNull: true,
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

      // Peso que llega originalmente en la báscula (Peso Bruto)
      cantidad: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      // --- CAMPOS DE CALIDAD ---
      humedad: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
      },

      impurezas: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
      },

      // Cuántas unidades (ej: kilos) se restaron por humedad/impurezas
      descuentoMerma: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
      },

      // Cantidad final que se multiplica por el precio (Peso Neto)
      cantidadNeta: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      // -------------------------

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
      timestamps: true,
      tableName: 'DetalleLiquidaciones',
    }
  )
}

export default DetalleLiquidacionModel
