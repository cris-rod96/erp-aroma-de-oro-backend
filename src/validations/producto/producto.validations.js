import { body } from 'express-validator'

const validacionCrearProducto = [
  body('nombre').notEmpty().withMessage('El nombre del producto es obligatorio'),
  body('unidadMedida')
    .notEmpty()
    .withMessage('La unidad de medida es obligatoria')
    .trim()
    .isIn(['Quintales', 'Kilogramos', 'Libras', 'Unidades']),
  body('stock')
    .notEmpty()
    .withMessage('El stock es obligatorio.')
    .isNumeric()
    .withMessage('El stock debe ser un valor numérico'),
]

export default {
  validacionCrearProducto,
}
