import { Caja } from '../../libs/db.js'

const abrirCaja = async (data) => {
  // 1. Verificamos si ya hay una caja abierta
  const cajaAbierta = await Caja.findOne({
    where: {
      estado: 'Abierta',
    },
  })

  if (cajaAbierta) {
    return {
      code: 400,
      message: 'Ya existe una caja abierta. Debe cerrarla antes de iniciar un nuevo turno.',
    }
  }

  // 2. Preparamos los datos: El saldoActual DEBE ser igual al montoApertura al iniciar
  const nuevaCajaData = {
    ...data,
    saldoActual: data.montoApertura, // Aquí está la clave para tus validaciones
    totalInyecciones: 0,
    montoEsperado: 0,
    estado: 'Abierta',
  }

  try {
    const caja = await Caja.create(nuevaCajaData)

    return {
      code: 201,
      message: 'Caja abierta exitosamente para la jornada.',
      caja: caja.dataValues,
    }
  } catch (error) {
    console.error('Error al crear la caja:', error)
    return {
      code: 500,
      message: 'Error interno al intentar abrir la caja.',
    }
  }
}

export { abrirCaja }
