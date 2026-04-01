import { Persona } from '../../libs/db.js'
import { validatorsUtils } from '../../utils/index.utils.js'

const registrarPersona = async (data) => {
  const { numeroIdentificacion, telefono, correo, fechaNacimiento, tipoIdentificacion } = data

  const fechaAjustada = fechaNacimiento ? `${fechaNacimiento}T12:00:00` : null

  const existeIdentificacion = await Persona.findOne({
    where: {
      numeroIdentificacion,
    },
  })

  if (existeIdentificacion) {
    return {
      code: 400,
      message: 'Ya existe una persona registrada con este número de identificación',
    }
  }
  if (tipoIdentificacion === 'Cédula' && !validatorsUtils.validarCedula(numeroIdentificacion)) {
    return { code: 400, message: 'El número de cédula no es válido' }
  }

  if (tipoIdentificacion === 'RUC' && !validatorsUtils.validarRUC(numeroIdentificacion)) {
    return { code: 400, message: 'El número de RUC no es válido' }
  }

  if (telefono && !validatorsUtils.validarTelefono(telefono)) {
    return { code: 400, message: 'El número de teléfono no es válido' }
  }

  if (correo) {
    const existeEmail = await Persona.findOne({
      where: {
        correo,
      },
    })

    if (existeEmail) {
      return {
        code: 400,
        message: 'Ya existe una persona registrada con este correo electrónico',
      }
    }
  }

  const persona = await Persona.create({ ...data, fechaNacimiento: fechaAjustada })
  return persona
    ? {
        code: 201,
        message: 'Persona registrada exitosamente',
        persona,
      }
    : {
        code: 400,
        message: 'Persona no registrada. Intente de nuevo',
      }
}

export { registrarPersona }
