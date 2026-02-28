import { DataTypes } from "sequelize";

const CuentasPorCobrar = (sq) => {
  sq.define("CuentasPorCobrar", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
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
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fechaLimite: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    VentaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Venta",
        key: "id",
      },
    },
  });
};

export default CuentasPorCobrar;
