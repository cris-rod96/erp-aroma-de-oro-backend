import { DATABASE_CONFIG } from '../config/config.js'
import { Sequelize } from 'sequelize'
import { models } from '../models/index.models.js'

const sq = new Sequelize(DATABASE_CONFIG.URI, DATABASE_CONFIG.OPTIONS)

// Inicializar modelos
models.forEach((model) => model(sq))

const {
  Empresa,
  Persona,
  Usuario,
  Producto,
  Nomina,
  Ticket,
  Liquidacion,
  CuentasPorPagar,
  CuentasPorCobrar,
  DetalleLiquidacion,
  Retencion,
  Movimiento,
  Venta,
  Caja,
  Reporte,
  AbonosCuentasPorPagar,
  AbonosCuentasPorCobrar,
  Anticipo,
  LiquidacionAnticipo,
  Prestamo, // Nuevo modelo
  Gasto,
  Respaldo,
} = sq.models

// --- RELACIONES DE CAJA Y MOVIMIENTOS ---
Caja.hasMany(Movimiento, { foreignKey: 'CajaId' })
Movimiento.belongsTo(Caja, { foreignKey: 'CajaId' })

Usuario.hasMany(Caja, { foreignKey: 'UsuarioId' })
Caja.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

// --- RELACIONES DE VENTAS ---
Persona.hasMany(Venta, { foreignKey: 'PersonaId' })
Venta.belongsTo(Persona, { foreignKey: 'PersonaId' })

Producto.hasMany(Venta, { foreignKey: 'ProductoId' })
Venta.belongsTo(Producto, { foreignKey: 'ProductoId' })

Usuario.hasMany(Venta, { foreignKey: 'UsuarioId' })
Venta.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

Venta.hasMany(CuentasPorCobrar, { foreignKey: 'VentaId' })
CuentasPorCobrar.belongsTo(Venta, { foreignKey: 'VentaId' })

// --- RELACIONES DE LIQUIDACIÓN ---
Usuario.hasMany(Liquidacion, { foreignKey: 'UsuarioId' })
Liquidacion.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

Persona.hasMany(Liquidacion, { foreignKey: 'ProductorId' })
Liquidacion.belongsTo(Persona, { foreignKey: 'ProductorId' })

Liquidacion.hasOne(DetalleLiquidacion, { foreignKey: 'LiquidacionId' })
DetalleLiquidacion.belongsTo(Liquidacion, { foreignKey: 'LiquidacionId' })

Producto.hasMany(DetalleLiquidacion, { foreignKey: 'ProductoId' })
DetalleLiquidacion.belongsTo(Producto, { foreignKey: 'ProductoId' })

Liquidacion.hasMany(Retencion, { foreignKey: 'LiquidacionId' })
Retencion.belongsTo(Liquidacion, { foreignKey: 'LiquidacionId' })

Liquidacion.hasMany(CuentasPorPagar, { foreignKey: 'LiquidacionId' })
CuentasPorPagar.belongsTo(Liquidacion, { foreignKey: 'LiquidacionId' })

// --- RELACIONES DE NÓMINA Y PERSONAS ---
Persona.hasMany(Nomina, { foreignKey: 'PersonaId' })
Nomina.belongsTo(Persona, { foreignKey: 'PersonaId' })

Usuario.hasMany(Nomina, { foreignKey: 'UsuarioId' })
Nomina.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

// --- RELACIONES DE PRÉSTAMOS (NUEVO) ---
Persona.hasMany(Prestamo, { foreignKey: 'PersonaId' })
Prestamo.belongsTo(Persona, { foreignKey: 'PersonaId' })

Usuario.hasMany(Prestamo, { foreignKey: 'UsuarioId' })
Prestamo.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

Caja.hasMany(Prestamo, { foreignKey: 'CajaId' })
Prestamo.belongsTo(Caja, { foreignKey: 'CajaId' })

// Un préstamo puede ser pagado a través de varias nóminas (descuentos)
Prestamo.hasMany(Nomina, { foreignKey: 'PrestamoId' })
Nomina.belongsTo(Prestamo, { foreignKey: 'PrestamoId' })

// --- RELACIONES DE TICKETS ---
Producto.hasMany(Ticket, { foreignKey: 'ProductoId' })
Ticket.belongsTo(Producto, { foreignKey: 'ProductoId' })

// --- POLIMORFISMO DE MOVIMIENTOS (idReferencia) ---
Movimiento.belongsTo(Liquidacion, {
  foreignKey: 'idReferencia',
  constraints: false,
  as: 'detalleCompra',
})

Movimiento.belongsTo(Venta, {
  foreignKey: 'idReferencia',
  constraints: false,
  as: 'detalleVenta',
})

Movimiento.belongsTo(Nomina, {
  foreignKey: 'idReferencia',
  constraints: false,
  as: 'detalleNomina',
})

Movimiento.belongsTo(Prestamo, {
  foreignKey: 'idReferencia',
  constraints: false,
  as: 'detallePrestamo',
})

Movimiento.belongsTo(Gasto, {
  foreignKey: 'idReferencia',
  constraints: false,
  as: 'detalleGasto',
})
Movimiento.belongsTo(Anticipo, {
  foreignKey: 'idReferencia',
  constraints: false,
  as: 'detalleAnticipo',
})

// --- CUENTAS POR COBRAR / PAGAR ---
Venta.hasMany(CuentasPorCobrar, { foreignKey: 'VentaId' })
CuentasPorCobrar.belongsTo(Venta, { foreignKey: 'VentaId' })

CuentasPorCobrar.hasMany(AbonosCuentasPorCobrar, { foreignKey: 'CuentasPorCobrarId' })
AbonosCuentasPorCobrar.belongsTo(CuentasPorCobrar, { foreignKey: 'CuentasPorCobrarId' })

CuentasPorPagar.hasMany(AbonosCuentasPorPagar, { foreignKey: 'CuentaPorPagarId' })
AbonosCuentasPorPagar.belongsTo(CuentasPorPagar, { foreignKey: 'CuentaPorPagarId' })

Usuario.hasMany(AbonosCuentasPorCobrar, { foreignKey: 'UsuarioId' })
AbonosCuentasPorCobrar.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

Usuario.hasMany(AbonosCuentasPorPagar, { foreignKey: 'UsuarioId' })
AbonosCuentasPorPagar.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

Usuario.hasMany(Reporte, { foreignKey: 'UsuarioId' })
Reporte.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

// --- RELACIONES DE ANTICIPOS ---
Persona.hasMany(Anticipo, { foreignKey: 'PersonaId' })
Anticipo.belongsTo(Persona, { foreignKey: 'PersonaId' })

Caja.hasMany(Anticipo, { foreignKey: 'CajaId' })
Anticipo.belongsTo(Caja, { foreignKey: 'CajaId' })

Usuario.hasMany(Anticipo, { foreignKey: 'UsuarioId' })
Anticipo.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

Liquidacion.belongsToMany(Anticipo, {
  through: LiquidacionAnticipo,
  foreignKey: 'LiquidacionId',
})

Anticipo.belongsToMany(Liquidacion, {
  through: LiquidacionAnticipo,
  foreignKey: 'AnticipoId',
})

Liquidacion.hasMany(LiquidacionAnticipo, { foreignKey: 'LiquidacionId' })
Anticipo.hasMany(LiquidacionAnticipo, { foreignKey: 'AnticipoId' })

Anticipo.hasOne(CuentasPorCobrar, {
  foreignKey: 'referenciaId',
  constraints: false,
  scope: { origen: 'Anticipo' },
})

CuentasPorCobrar.belongsTo(Anticipo, {
  foreignKey: 'referenciaId',
  constraints: false,
})
CuentasPorCobrar.belongsTo(Prestamo, {
  foreignKey: 'referenciaId',
  constraints: false,
})
CuentasPorCobrar.belongsTo(Venta, {
  foreignKey: 'referenciaId',
  constraints: false,
})

Movimiento.belongsTo(Anticipo, {
  foreignKey: 'idReferencia',
  constraints: false,
})
Movimiento.belongsTo(Prestamo, {
  foreignKey: 'idReferencia',
  constraints: false,
})

Caja.hasMany(Gasto, { foreignKey: 'CajaId' })
Gasto.belongsTo(Caja, { foreignKey: 'CajaId' })

Usuario.hasMany(Gasto, { foreignKey: 'UsuarioId' })
Gasto.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

Caja.hasMany(Venta, { foreignKey: 'CajaId' })
Venta.belongsTo(Caja, { foreignKey: 'CajaId' })

Caja.hasMany(Respaldo, { foreignKey: 'CajaId' })
Respaldo.belongsTo(Caja, { foreignKey: 'CajaId' })

export {
  sq,
  Empresa,
  Persona,
  Usuario,
  Producto,
  Nomina,
  Ticket,
  Liquidacion,
  CuentasPorPagar,
  CuentasPorCobrar,
  DetalleLiquidacion,
  Retencion,
  Movimiento,
  Venta,
  Caja,
  Reporte,
  AbonosCuentasPorCobrar,
  AbonosCuentasPorPagar,
  Anticipo,
  LiquidacionAnticipo,
  Prestamo,
  Gasto,
  Respaldo,
}
