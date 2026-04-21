import { DataTypes } from 'sequelize'

const CuentasPorCobrar = (sq) => {
  sq.define(
    'CuentasPorCobrar',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      montoTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      montoCheque: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      montoEfectivo: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      montoTransferencia: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      abonoAnticipado: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      montoPorCobrar: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      comentario: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      estado: {
        type: DataTypes.ENUM,
        values: ['Pendiente', 'Cobrado'],
        defaultValud: 'Pendiente',
      },

      origen: {
        type: DataTypes.ENUM('Venta', 'Anticipo', 'Préstamo'),
        allowNull: false,
        defaultValue: 'Venta',
      },

      referenciaId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: 'CuentasPorCobrar',
    }
  )
}

export default CuentasPorCobrar
