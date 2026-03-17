import { DataTypes } from 'sequelize'

const ReporteModel = (sq) => {
  sq.define(
    'Reporte',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipo: {
        type: DataTypes.ENUM,
        values: ['CAJA', 'VENTAS', 'COMPRAS', 'IVENTARIO', 'GENERAL'],
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      publicId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      fechaCreacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      fechaRangoInicio: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      fechaRangoFin: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      formato: {
        type: DataTypes.ENUM,
        values: ['PDF', 'EXCEL'],
        allowNull: false,
      },

      UsuarioId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id',
        },
      },
    },
    { timestamps: false, tableName: 'Reportes' }
  )
}

export default ReporteModel
