import { Persona } from '../../libs/db.js'
import { validatorsUtils } from '../../utils/index.utils.js'

const actualizarPersona = async (id, data) => {
  const persona = await Persona.findOne({
    where: {
      id,
    },
  })

  if (!persona) {
    return { code: 404, message: 'Persona no encontrada' }
  }

  const { telefono, correo } = data

  if (telefono) {
    if (!validatorsUtils.validarTelefono(telefono)) {
      return { code: 400, message: 'El número de teléfono no es válido' }
    }
    const existeOtraPersona = await Persona.findOne({
      where: {
        telefono,
      },
    })

    if (existeOtraPersona && existeOtraPersona.id !== id) {
      return {
        code: 400,
        message: 'El teléfono ya extá registrado por otra persona',
      }
    }
  }

  if (correo) {
    const existeOtraPersona = await Persona.findOne({
      where: {
        correo,
      },
    })

    if (existeOtraPersona && existeOtraPersona.id !== id) {
      return {
        code: 400,
        message: 'El correo ya extá registrado por otra persona',
      }
    }
  }

  persona.update(data)

  return {
    code: 200,
    message: 'Información actualizada con éxito',
  }
}

const recuperarProductor = async (id, data) => {
  const productor = await Persona.findByPk(id)
  if (!productor) return { code: 404, message: 'Productor no encontrado' }

  if (productor.tipo !== 'Productor') return { code: 404, message: 'Productor no encontrado' }

  if (productor.estaActivo) return { code: 400, message: 'El productor ya se encuentra activo' }

  await productor.update(data)
  return { code: 200, message: 'Productor recuperado con éxito' }
}
const recuperarComprador = async (id, data) => {
  const comprador = await Persona.findByPk(id)
  if (!comprador) return { code: 404, message: 'Comprador no encontrado' }

  if (comprador.tipo !== 'Comprador') return { code: 404, message: 'Comprador no encontrado' }

  if (comprador.estaActivo) return { code: 400, message: 'El comprador ya se encuentra activo' }

  await comprador.update(data)
  return { code: 200, message: 'Comprador recuperado con éxito' }
}
const recuperarTrabajador = async (id, data) => {
  const trabajador = await Persona.findByPk(id)
  if (!trabajador) return { code: 404, message: 'Trabajador no encontrado' }

  if (trabajador.tipo !== 'Trabajador') return { code: 404, message: 'Trabajador no encontrado' }

  if (trabajador.estaActivo) return { code: 400, message: 'El trabajador ya se encuentra activo' }

  await trabajador.update(data)
  return { code: 200, message: 'Trabajador recuperado con éxito' }
}

export { actualizarPersona, recuperarComprador, recuperarTrabajador, recuperarProductor }
