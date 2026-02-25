import { Op } from "sequelize";
import { Nomina, Persona } from "../../libs/db.js";

const pagarJornal = async (PersonaId, data) => {
  const persona = await Persona.findOne({
    where: {
      id: PersonaId,
    },
  });

  if (!persona) return { code: 404, message: "Empleado no encontrado" };

  const hoy = new Date();
  const inicio = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate(),
    0,
    0,
    0,
  );
  const fin = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate(),
    23,
    59,
    59,
  );

  const jornalPagado = await Nomina.findOne({
    where: {
      PersonaId,
      fechaPago: {
        [Op.between]: [inicio, fin],
      },
    },
  });

  if (jornalPagado)
    return {
      code: 400,
      message: "Este empleado ya tiene un pago registrado hoy.",
    };

  const pago = await Nomina.create({
    ...data,
    PersonaId,
  });
  return pago
    ? {
        code: 200,
        message: "Pago registrado con éxito",
      }
    : {
        code: 400,
        message: "Error al registrar el pago. Intente de nuevo.",
      };
};

export { pagarJornal };
