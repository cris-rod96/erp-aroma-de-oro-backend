import { Empresa } from '../../libs/db.js'
import { validatorsUtils } from '../../utils/index.utils.js'

const crearEmpresa = async (data) => {
  const { RUC, telefono } = data
  if (!RUC) return { code: 400, message: 'El RUC de la empresa es obligatorio.' }
  if (!telefono) return { code: 400, message: 'El teléfono de la empresa es obligatorio.' }

  if (!validatorsUtils.validarRUC(RUC))
    return { code: 400, message: 'El RUC ingresado no es válido' }

  if (!validatorsUtils.validarTelefono(telefono))
    return { code: 400, message: 'El teléfono ingresado no es valido' }

  const empresa = await Empresa.create(data)
  return { code: 201, empresa }
}

export { crearEmpresa }
