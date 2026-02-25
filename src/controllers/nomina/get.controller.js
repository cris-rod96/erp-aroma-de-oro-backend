import { nominaService } from "../../services/index.services.js";

const listarPagos = async (req, res) => {
  try {
    const { code, pagos } = await nominaService.listarPagos();
    res.status(code).json({ pagos });
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo",
    });
  }
};
const listarPagosPorEmpleado = async (req, res) => {
  try {
    const { persona_id } = req.params;
    const { code, message, pagos } =
      await nominaService.listarPagosPorEmpleado(persona_id);

    res.status(code).json(message ? { message } : { pagos });
  } catch (error) {
    res.status(500).json({
      message: "Error interno en el servidor. Intente de nuevo",
    });
  }
};

export { listarPagos, listarPagosPorEmpleado };
