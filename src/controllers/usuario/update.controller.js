import { usuarioService } from "../../services/index.services.js";

const actualizarInformacion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { code, message } = await usuarioService.actualizarInformacion(
      id,
      data,
    );
    res.status(code).json({ message });
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo",
    });
  }
};

const actualizarClave = async (req, res) => {
  try {
    const { id } = req.params;
    const { clave } = req.body;
    const { code, message } = await usuarioService.actualizarClave(id, clave);
    res.status(code).json({ message });
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo",
    });
  }
};

export { actualizarInformacion, actualizarClave };
