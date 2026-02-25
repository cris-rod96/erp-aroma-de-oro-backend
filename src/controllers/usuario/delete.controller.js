import { usuarioService } from "../../services/index.services.js";

const borrarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, message } = await usuarioService.borrarUsuario(id);
    res.status(code).json({
      message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo.",
    });
  }
};

export { borrarUsuario };
