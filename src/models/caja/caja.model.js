import { DataTypes } from "sequelize";

const CajaModel = (sq) => {
  sq.define("Caja", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    fechaApertura: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    fechaCierre: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    montoApertura: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    montoCierre: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    estado: {
      type: DataTypes.ENUM,
      values: ["Abierta", "Cerrada"],
      defaultValue: "Abierta",
    },
  });
};

export default CajaModel;
