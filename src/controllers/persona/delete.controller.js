import { personaService } from "../../services/index.services.js";

const borrarPersona = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, message } = await personaService.borrarPersona(id);
    res.status(code).json({ message });
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo.",
    });
  }
};

export { borrarPersona };
