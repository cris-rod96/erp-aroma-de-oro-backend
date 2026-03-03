import { liquidacionService } from "../../services/index.services.js";

const listarPorProductor = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, message, liquidaciones } =
      await liquidacionService.listarPorProductor(id);
    res.status(code).json(message ? { message } : { liquidaciones });
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo.",
    });
  }
};

const listarPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, message, liquidaciones } =
      await liquidacionService.listarPorUsuario(id);

    res.status(code).json(message ? { message } : { liquidaciones });
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo.",
    });
  }
};

const listarTodas = async (req, res) => {
  try {
    const { code, liquidaciones } = await liquidacionService.listarTodas();
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo.",
    });
  }
};
