import { Caja } from "../../libs/db.js";

const abrirCaja = async (data) => {
  const cajaAbierta = await Caja.findOne({
    where: {
      estado: "Abierta",
    },
  });

  if (cajaAbierta)
    return {
      code: 400,
      message:
        "Ya existe una caja abierta para este día. Cierre la caja existente y vuelva a intentarlo.",
    };

  const caja = await Caja.create(data);
  return {
    code: 201,
    message: "Caja abierta para el día de hoy",
    caja: caja.dataValues,
  };
};

export { abrirCaja };
