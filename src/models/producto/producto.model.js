import { DataTypes } from 'sequelize'

const ProductoModel = (sq) => {
  sq.define(
    'Producto',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      unidadMedida: {
        type: DataTypes.ENUM,
        values: ['Quintales', 'Kilogramos', 'Libras', 'Unidades'],
        defaultValue: 'Quintales',
        allowNull: false,
      },
      stock: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          min: 0,
        },
      },
      estaActivo: {
        // Útil para "deshabilitar" productos sin borrarlos
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      fechaCreacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false, // O true si quieres manejar createdAt/updatedAt automáticamente
    }
  )
}

export default ProductoModel
