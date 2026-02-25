import { personaService } from "../../services/index.services.js";

const actualizarPersona = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { code, message } = await personaService.actualizarPersona(id, data);
    res.status(code).json({
      message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo",
    });
  }
};

export { actualizarPersona };
