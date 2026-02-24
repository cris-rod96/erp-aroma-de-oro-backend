import { Usuario } from "../../libs/db.js";
import { bcryptUtils } from "../../utils/index.utils";

const actualizarInformacion = async (id, data) => {
  const usuario = await Usuario.findOne({
    where: {
      id,
    },
  });

  if (!usuario) return { code: 404, message: "Usuario no encontrado" };

  const { telefono, correo } = data;

  if (telefono) {
    const otroUsuario = await Usuario.findOne({
      where: {
        telefono,
      },
    });

    if (otroUsuario && otroUsuario.id !== id) {
      return {
        code: 400,
        message: "Ya existe otro usuario con este teléfono",
      };
    }
  }

  if (correo) {
    const otroUsuario = await Usuario.findOne({
      where: {
        correo,
      },
    });

    if (otroUsuario && otroUsuario.id !== id) {
      return {
        code: 400,
        message: "Ya existe otro usuario con este correo",
      };
    }
  }

  await usuario.update(data);

  return {
    code: 200,
    message: "Información del usuario actualizada con éxito",
  };
};

const actualizarClave = async (id, nuevaClave) => {
  const usuario = Usuario.findOne({
    where: {
      id,
    },
  });

  if (!usuario) return { code: 404, message: "Usuario no encontrado" };

  const claveCifrada = await bcryptUtils.hashPassword(nuevaClave);

  await usuario.update({
    clave: claveCifrada,
  });

  return {
    code: 200,
    message: "Contraseña actualiza con éxito",
  };
};

export { actualizarInformacion, actualizarClave };
