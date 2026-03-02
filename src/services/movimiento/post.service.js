import { Movimiento, Venta, Nomina, Liquidacion } from "../../libs/db.js";

const crearMovimiento = async (data) => {
  const { categoria, idReferencia } = data;

  switch (categoria) {
    case "Compra":
      const liquidacion = await Liquidacion.findOne({
        where: {
          id: idReferencia,
        },
      });

      if (!liquidacion)
        return {
          code: 404,
          message:
            "Error al crear el registro de movimiento. Registro no encontrado.",
        };

      break;

    case "Venta":
      const venta = await Venta.findOne({
        where: {
          id: idReferencia,
        },
      });

      if (!venta)
        return {
          code: 404,
          message:
            "Error al crear el registro de movimiento. Registro de referencia no encontrado",
        };
      break;

    case "Nomina":
      const nomina = await Nomina.findOne({
        where: {
          id: idReferencia,
        },
      });
      if (!nomina)
        return {
          code: 404,
          message:
            "Error al encontrar el registro de movimiento. Registro de referencia no encontrado.",
        };
      break;
  }

  const caja = await Movimiento.create(data);
  return { code: 201, message: "Movimiento creado", caja };
};

export { crearMovimiento };
