import { DataTypes } from 'sequelize'

const CajaModel = (sq) => {
  sq.define(
    'Caja',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      estado: {
        type: DataTypes.ENUM,
        values: ['Abierta', 'Cerrada'],
        defaultValue: 'Abierta',
      },

      fechaApertura: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      fechaCierre: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      // --- DINERO INICIAL ---
      montoApertura: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Dinero físico con el que se inicia el turno',
      },

      // --- CONTROL EN TIEMPO REAL ---
      saldoActual: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Saldo que fluctúa con cada venta, compra o inyección de banco',
      },

      // --- CAMPOS DE AUDITORÍA AL CIERRE ---
      totalInyecciones: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
        comment: 'Suma total de dinero ingresado desde Bancos u Otros durante el turno',
      },

      montoEsperado: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
        comment: 'Cálculo final del sistema: Apertura + Ingresos - Egresos',
      },

      montoCierre: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Dinero físico reportado por el cajero al finalizar',
      },

      diferencia: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Descuadre: montoCierre - montoEsperado',
      },

      observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      // --- RELACIONES ---
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
      timestamps: true,
      tableName: 'Cajas',
    }
  )
}

export default CajaModel
