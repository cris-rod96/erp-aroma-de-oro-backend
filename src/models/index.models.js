import EmpresaModel from './empresa/empresa.model.js'
import NominaModel from './nomina/nomina.model.js'
import PersonaModel from './persona/persona.model.js'
import ProductoModel from './producto/producto.model.js'
import UsuarioModel from './usuario/usuario.model.js'
import TicketModel from './ticket/ticket.model.js'
import LiquidacionModel from './liquidacion/liquidacion.model.js'
import RetencionModel from './retencion/retencion.model.js'
import DetalleLiquidacion from './detalle_liquidacion/detalle_liquidacion.model.js'
import CuentasPorPagarModel from './cuentas_por_pagar/cuentas_por_pagar.js'
import VentasModel from './venta/venta.model.js'
import CuentasPorCobrarModel from './cuentas_por_cobrar/cuentas_por_cobrar.js'
import MovimientoModel from './movimiento/movimiento.model.js'
import CajaModel from './caja/caja.model.js'
import ReporteModel from './reporte/reporte.model.js'
import AbonosCuentasPorCobrar from './abonos_por_cobrar/AbonosPorCobrar.model.js'
import AbonosCuentasPorPagar from './abonos_por_pagar/AbonosPorPagar.model.js'
import AnticipoModel from './anticipo/anticipo.model.js'
import LiquidacionAnticipoModel from './liquidacionAnticipo/LiquidacionAnticipo.model.js'
import PrestamoModel from './prestamo/prestamo.model.js'
import GastoModel from './gasto/gasto.model.js'
import RespaldoModel from './respaldo/respaldo.model.js'
export const models = [
  EmpresaModel,
  PersonaModel,
  UsuarioModel,
  ProductoModel,
  NominaModel,
  TicketModel,
  LiquidacionModel,
  DetalleLiquidacion,
  RetencionModel,
  VentasModel,
  CuentasPorCobrarModel,
  CuentasPorPagarModel,
  MovimientoModel,
  CajaModel,
  ReporteModel,
  AbonosCuentasPorCobrar,
  AbonosCuentasPorPagar,
  AnticipoModel,
  LiquidacionAnticipoModel,
  PrestamoModel,
  GastoModel,
  RespaldoModel,
]
