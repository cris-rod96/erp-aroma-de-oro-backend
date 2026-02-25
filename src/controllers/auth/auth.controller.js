import { authService } from "../../services/index.services.js";

const iniciarSesion = async (req, res) => {
  try {
    const { correo, clave } = req.body;

    const { code, message, data, token } = await authService.iniciarSesion(
      correo,
      clave,
    );

    res.status(code).json(
      message
        ? {
            message,
          }
        : {
            data,
            token,
          },
    );
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo.",
    });
  }
};

export default {
  iniciarSesion,
};
