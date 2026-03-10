import { DataTypes } from 'sequelize'

const MovimientoModel = (sq) => {
  sq.define('Movimiento', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    tipoMovimiento: {
      type: DataTypes.ENUM,
      values: ['Ingreso', 'Egreso'],
      allowNull: false,
    },

    categoria: {
      type: DataTypes.ENUM,
      values: ['Compra', 'Venta', 'Gasto', 'Nomina'],
      allowNull: false,
    },

    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    idReferencia: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    CajaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Cajas',
        key: 'id',
      },
    },
  })
}

export default MovimientoModel
