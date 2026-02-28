import { DataTypes } from "sequelize";

const CuentasPorPagar = (sq) => {
  sq.define("CuentasPorPagar", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    montoTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    montoAbonado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    saldoPendiente: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    estado: {
      type: DataTypes.ENUM,
      values: ["Pendiente", "Pagado"],
      defaultValue: "Pendiente",
    },

    fechaAbono: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    fechaLimitePago: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    LiquidacionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Liquidacions",
        key: "id",
      },
    },
  });
};

export default CuentasPorPagar;
