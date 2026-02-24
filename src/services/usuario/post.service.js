import { Usuario } from "../../libs/db.js";
import { bcryptUtils } from "../../utils/index.utils.js";

const agregarUsuario = async (data) => {
  const { cedula, telefono, correo, clave } = data;

  const existeCedula = await Usuario.findOne({
    where: {
      cedula,
    },
  });

  if (existeCedula)
    return {
      code: 400,
      message: "Ya existe un usuario registrado con esta cédula",
    };

  const existeTelefono = await Usuario.findOne({
    where: {
      telefono,
    },
  });

  if (existeTelefono)
    return {
      code: 400,
      message: "Ya existe un usuario registrado con este teléfono",
    };

  const correoExiste = await Usuario.findOne({
    where: {
      correo,
    },
  });

  if (correoExiste)
    return {
      code: 400,
      message: "Ya existe un usuario registrado con este correo",
    };

  const claveCifrada = await bcryptUtils.hashPassword(clave);
  const usuario = await Usuario.create({
    ...data,
    clave: claveCifrada,
  });

  return usuario
    ? {
        code: 201,
        message: "Usuario registrado con éxito",
      }
    : {
        code: 400,
        message: "Error al registrar el usuario. Intente de nuevo",
      };
};

export { agregarUsuario };
