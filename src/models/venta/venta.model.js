import { DataTypes } from "sequelize";

const VentasModel = (sq) => {
  sq.define("Venta", {
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
    cantidadQuintales: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    porcentajeIVA: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    totalIva: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    totalFactura: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    estado: {
      type: DataTypes.ENUM,
      values: ["Cobrado", "Crédito"],
      allowNull: false,
    },
    montoPendiente: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fechaLimite: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    CompradorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Personas",
        key: "id",
      },
    },
    ProductoId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Productos",
        key: "id",
      },
    },
    UsuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Usuarios",
        key: "id",
      },
    },
  });
};

export default VentasModel;
