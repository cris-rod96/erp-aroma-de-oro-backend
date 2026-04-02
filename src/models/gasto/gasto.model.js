import { DataTypes } from 'sequelize'

const GastoModel = (sq) => {
  sq.define(
    'Gasto',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      // Código secuencial: GAS-0000001
      codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },
      // Aquí va la "Justificación" que pidió el cliente
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        // Forzamos a que siempre se guarde en mayúsculas para orden contable
        set(val) {
          this.setDataValue('descripcion', val.toUpperCase())
        },
      },
      // Categorías para que el cliente filtre después
      categoria: {
        type: DataTypes.ENUM(
          'Alimentación',
          'Repuestos',
          'Combustible',
          'Mantenimiento',
          'Suministros',
          'Cumpleaños',
          'Bonificaciones',
          'Varios'
        ),
        defaultValue: 'Varios',
      },
      fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      // Relaciones obligatorias
      CajaId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      UsuarioId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'Gastos',
    }
  )
}

export default GastoModel
