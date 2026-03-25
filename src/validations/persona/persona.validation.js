import { body } from 'express-validator'

const validacionCrearPersona = [
  body('tipoIdentificacion')
    .notEmpty()
    .withMessage('El tipo de identificación es obligatorio')
    .trim()
    .isIn(['Cédula', 'Pasaporte', 'RUC'])
    .withMessage('El tipo de identificación no es válido'),

  body('numeroIdentificacion')
    .notEmpty()
    .withMessage('El número de identificación es obligatorio.')
    .custom((value, { req }) => {
      const tipo = req.body.tipoIdentificacion?.toLowerCase()

      if (!tipo) {
        throw new Error('Debes especificar el tipo de indentificación primero.')
      }

      if (tipo === 'cédula') {
        if (!/^[0-9]{10}$/.test(value)) {
          throw new Error('La cédula debe tener exactamente 10 dígitos numéricos')
        }
        return true
      }

      if (tipo === 'pasaporte') {
        if (!/^[A-Za-z0-9]{6,20}$/.test(value)) {
          throw new Error('El pasaporte debe tener entre 6 y 20 caracteres alfanuméricos')
        }
        return true
      }

      if (tipo === 'ruc') {
        if (!/^[0-9]{13}$/.test(value)) {
          throw new Error('El RUC debe tener exactamente 13 dígitos numéricos')
        }
        return true
      }

      throw new Error('Tipo de identificación no válido')
    }),

  body('tipo')
    .notEmpty()
    .withMessage('El tipo de persona a registrar es obligatorio.')
    .trim()
    .toLowerCase()
    .isIn(['productor', 'comprador', 'trabajador'])
    .withMessage('El tipo de persona no es válido'),

  body('telefono')
    .optional({ checkFalsy: true }) // Ignora el campo si no viene, si viene null, o si es un string vacío ""
    .matches(/^[0-9]{10}$/)
    .withMessage('El teléfono debe tener exactamente 10 dígitos numéricos'),

  // --- CORREO OPCIONAL ---
  body('correo')
    .optional({ checkFalsy: true })
    .matches(/^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Debe ser un correo válido y realista')
    .normalizeEmail(),
]

export default {
  validacionCrearPersona,
}
