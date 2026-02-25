import { nominaService } from "../../services/index.services.js";

const pagarJornal = async (req, res) => {
  try {
    const { persona_id } = req.params;
    const data = req.body;
    const { code, message } = await nominaService.pagarJornal(persona_id, data);
    res.status(code).json({
      message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo.",
    });
  }
};

export { pagarJornal };
