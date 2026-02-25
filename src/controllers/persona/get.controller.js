import { personaService } from "../../services/index.services.js";

const listarPersonas = async (req, res) => {
  try {
    const { code, personas } = await personaService.listarPersonas();
    res.status(code).json({
      personas,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo.",
    });
  }
};

const listarPersonaPorClave = async (req, res) => {
  try {
    const { key, value } = req.query;
    const { code, message, persona } =
      await personaService.listarPersonaPorClave(key, value);

    res.status(code).json(message ? { message } : { persona });
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo.",
    });
  }
};

export { listarPersonas, listarPersonaPorClave };
