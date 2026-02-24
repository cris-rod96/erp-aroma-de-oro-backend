import { DataTypes} from "sequelize";

const ProductoModel = (sq) => {
    sq.define("Producto", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        unidadMedida: {
            type: DataTypes.ENUM,
            values: [
                "Quintales"
            ],
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        fechaCreacion: {
            type: DataTypes.DATE,
            defaultValue: Date.now()
        }
    })
}

export default ProductoModel