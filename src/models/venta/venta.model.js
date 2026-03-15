import { DataTypes } from 'sequelize'

const VentasModel = (sq) => {
  sq.define(
    'Venta',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      numeroFactura: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      // --- DATOS DE CANTIDAD Y PRECIO ---
      cantidadQuintales: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      precioUnitario: {
        type: DataTypes.DECIMAL(12, 4), // Mayor precisión para evitar pérdida de centavos
        allowNull: false,
      },

      // --- BLOQUE FINANCIERO ---
      subtotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      porcentajeIVA: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      totalIva: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
      totalFactura: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },

      // --- GESTIÓN DE COBROS Y CRÉDITO ---
      estado: {
        type: DataTypes.ENUM('Cobrado', 'Crédito'),
        allowNull: false,
      },
      montoAbonado: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      montoPendiente: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      fechaLimite: {
        type: DataTypes.DATE,
        allowNull: true, // Puede ser nulo si la venta es de contado
      },

      // --- RELACIONES (FOREIGN KEYS) ---
      CompradorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Personas',
          key: 'id',
        },
      },
      ProductoId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Productos',
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
      timestamps: true, // Crea automáticamente createdAt y updatedAt
      tableName: 'Ventas',
    }
  )
}

export default VentasModel
