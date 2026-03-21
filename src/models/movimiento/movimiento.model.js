import { DataTypes } from 'sequelize'

const MovimientoModel = (sq) => {
  sq.define(
    'Movimiento',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      tipoMovimiento: {
        type: DataTypes.ENUM,
        values: ['Ingreso', 'Egreso'],
        allowNull: false,
      },
      categoria: {
        type: DataTypes.ENUM,
        // Agregamos 'Bancos' para inyecciones/retiros y 'Otros' para imprevistos
        values: ['Compra', 'Venta', 'Gasto', 'Nomina', 'Bancos', 'Otros'],
        allowNull: false,
      },
      monto: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      // Permitimos NULL para que movimientos manuales (Bancos/Otros) no se bloqueen
      idReferencia: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      // Campo vital para auditoría en Aroma de Oro
      descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      CajaId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Cajas',
          key: 'id',
        },
      },
    },
    {
      timestamps: true, // Registra automáticamente cuándo se creó el movimiento
      tableName: 'Movimientos',
    }
  )
}

export default MovimientoModel
