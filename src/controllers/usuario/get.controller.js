import { usuarioService } from "../../services/index.services.js";

const listarUsuarios = async (req, res) => {
  try {
    const { code, usuarios } = await usuarioService.listarUsuarios();

    res.status(code).json({ usuarios });
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo",
    });
  }
};
const listarUsuarioPorClave = async (req, res) => {
  try {
    const { key, value } = req.query;
    const { code, usuario, message } =
      await usuarioService.listarUsuarioPorClave(key, value);
    res.status(code).json(message ? { message } : { usuario });
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo",
    });
  }
};

export { listarUsuarios, listarUsuarioPorClave };
