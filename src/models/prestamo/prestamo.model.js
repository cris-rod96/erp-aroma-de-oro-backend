import { DataTypes } from 'sequelize'

const PrestamoModel = (sq) => {
  sq.define(
    'Prestamo',
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
      cuotasPactadas: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      cuotasPagadas: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      comentario: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      montoCuota: {
        // Cuánto se le descuenta por periodo (opcional)
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      saldoPendiente: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      estado: {
        type: DataTypes.ENUM('Pendiente', 'Pagado', 'Cancelado'),
        defaultValue: 'Pendiente',
      },
      fechaPrestamo: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      PersonaId: {
        // A quién se le prestó
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Personas', key: 'id' },
      },
    },
    {
      timestamps: true,
      tableName: 'Prestamos',
    }
  )
}

export default PrestamoModel
