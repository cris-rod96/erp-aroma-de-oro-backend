import { DataTypes } from "sequelize";

const LiquidacionModel = (sq) => {
  sq.define("Liquidacion", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    subtotal_12: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    subtotal_0: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    ivaTotal: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },

    totalRetencion: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    totalLiquidacion: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    totalAPagar: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    pagoEfectivo: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    pagoCheque: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },

    pagoTransferencia: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },

    montoAbonado: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },

    montoPorPagar: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },

    // Usuario que registra
    UsuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Usuarios",
        key: "id",
      },
    },

    // Persona que vende su producto
    ProductorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Personas",
        key: "id",
      },
    },

    TicketId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Tickets",
        key: "id",
      },
    },
  });
};

export default LiquidacionModel;
