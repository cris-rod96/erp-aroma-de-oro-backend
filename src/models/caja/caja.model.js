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
        allowNull: false,
        defaultValue: 0,
      },
      // Lo que el sistema calcula basado en movimientos
      montoEsperado: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      // Lo que el cajero cuenta físicamente al final
      montoCierre: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      // Resultado del arqueo (Cierre - Esperado)
      diferencia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      estado: {
        type: DataTypes.ENUM,
        values: ['Abierta', 'Cerrada'],
        defaultValue: 'Abierta',
      },
      observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // Relación con el responsable
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
      timestamps: true, // ¡Recomendado para auditoría!
      tableName: 'Cajas',
      hooks: {
        beforeCreate: (caja) => {
          caja.montoEsperado = caja.montoApertura
        },
      },
    }
  )
}

export default CajaModel
