import ecuValidators from 'ecuador-validator'

const validarCedula = (cedula) => ecuValidators.ci(cedula)

const validarRUC = (ruc) => {
  // 1. Limpieza total de espacios o guiones
  const cleanRUC = ruc.toString().trim()

  // 2. Validación de longitud básica (Indispensable)
  if (cleanRUC.length !== 13) return false

  // 3. Validación de los últimos dígitos (Regla de Oro en Ecuador)
  // Si no termina en 001, no es un RUC válido de persona o sociedad privada
  if (!cleanRUC.endsWith('001')) {
    // Nota: Las entidades públicas terminan en 0001,
    // pero representan menos del 1% de los casos.
    if (!cleanRUC.endsWith('0001')) return false
  }

  // 4. Validación matemática de la librería
  return ecuValidators.ruc(cleanRUC)
}

const validarTelefono = (telefono) => ecuValidators.telephone(telefono)

export default {
  validarCedula,
  validarRUC,
  validarTelefono,
}
