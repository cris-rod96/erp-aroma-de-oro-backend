import { DataTypes } from 'sequelize'

const PersonaModel = (sq) => {
  sq.define('Persona', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    nombreCompleto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipoIdentificacion: {
      type: DataTypes.ENUM,
      values: ['Cédula', 'Pasaporte', 'RUC'],
      allowNull: false,
    },
    numeroIdentificacion: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tipo: {
      type: DataTypes.ENUM,
      values: ['Productor', 'Comprador', 'Trabajador'],
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estaActivo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    },
  })
}

export default PersonaModel
