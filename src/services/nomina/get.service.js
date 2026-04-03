import { Nomina, Persona, Usuario } from '../../libs/db.js'

const listarPagos = async () => {
  const pagos = await Nomina.findAll({
    include: [
      { model: Persona },
      {
        model: Usuario,
        attributes: {
          exclude: ['clave'],
        },
      },
    ],

    order: [['createdAt', 'DESC']],
  })

  return {
    code: 200,
    pagos,
  }
}

const listarPagosPorEmpleado = async (PersonaId) => {
  const persona = await Persona.findOne({
    where: {
      id: PersonaId,
    },
    order: [['createdAt', 'DESC']],
  })

  if (!persona) return { code: 404, message: 'Empleado no encontrado' }

  const pagos = await Nomina.findAll({
    where: {
      PersonaId,
    },
  })

  return {
    code: 200,
    pagos,
  }
}

export { listarPagos, listarPagosPorEmpleado }
