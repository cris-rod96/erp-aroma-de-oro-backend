import { DATABASE_CONFIG } from '../config/config.js'
import { Sequelize } from 'sequelize'
import { models } from '../models/index.models.js'

const sq = new Sequelize(DATABASE_CONFIG.URI, DATABASE_CONFIG.OPTIONS)

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
} = sq.models

Persona.hasMany(Nomina, { foreignKey: 'PersonaId' })
Nomina.belongsTo(Persona, { foreignKey: 'PersonaId' })

Caja.hasMany(Movimiento, { foreignKey: 'CajaId' })
Movimiento.belongsTo(Caja, { foreignKey: 'CajaId' })

Usuario.hasMany(Caja, { foreignKey: 'UsuarioId' })
Caja.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

Persona.hasMany(Venta, { foreignKey: 'CompradorId' })
Venta.belongsTo(Persona, { foreignKey: 'CompradorId' })

Producto.hasMany(Venta, { foreignKey: 'ProductoId' })
Venta.belongsTo(Producto, { foreignKey: 'ProductoId' })

Usuario.hasMany(Venta, { foreignKey: 'UsuarioId' })
Venta.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

Venta.hasMany(CuentasPorCobrar, { foreignKey: 'VentaId' })
CuentasPorCobrar.belongsTo(Venta, { foreignKey: 'VentaId' })

Usuario.hasMany(Liquidacion, { foreignKey: 'UsuarioId' })
Liquidacion.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

Persona.hasMany(Liquidacion, { foreignKey: 'ProductorId' })
Liquidacion.belongsTo(Persona, { foreignKey: 'ProductorId' })

// Ticket.hasMany(Liquidacion, { foreignKey: 'TicketId' })
// Liquidacion.belongsTo(Ticket, { foreignKey: 'TicketId' })

Liquidacion.hasOne(DetalleLiquidacion, { foreignKey: 'LiquidacionId' })
DetalleLiquidacion.belongsTo(Liquidacion, { foreignKey: 'LiquidacionId' })

Producto.hasMany(DetalleLiquidacion, { foreignKey: 'ProductoId' })
DetalleLiquidacion.belongsTo(Producto, { foreignKey: 'ProductoId' })

Caja.hasMany(Movimiento, { foreignKey: 'CajaId' })
Movimiento.belongsTo(Caja, { foreignKey: 'CajaId' })

Persona.hasMany(Nomina, { foreignKey: 'PersonaId' })
Nomina.belongsTo(Persona, { foreignKey: 'PersonaId' })
Usuario.hasMany(Nomina, { foreignKey: 'UsuarioId' })
Nomina.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

Liquidacion.hasMany(Retencion, { foreignKey: 'LiquidacionId' })
Retencion.belongsTo(Liquidacion, { foreignKey: 'LiquidacionId' })

Producto.hasMany(Ticket, { foreignKey: 'ProductoId' })
Ticket.belongsTo(Producto, { foreignKey: 'ProductoId' })

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

Liquidacion.hasMany(CuentasPorPagar, { foreignKey: 'LiquidacionId' })
CuentasPorPagar.belongsTo(Liquidacion, { foreignKey: 'LiquidacionId' })

Venta.hasMany(CuentasPorCobrar, { foreignKey: 'VentaId' })
CuentasPorCobrar.hasMany(Venta, { foreignKey: 'VentaId' })

Usuario.hasMany(Reporte, { foreignKey: 'UsuarioId' })
Reporte.belongsTo(Usuario, { foreignKey: 'UsuarioId' })

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
}
