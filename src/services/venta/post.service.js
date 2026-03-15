import { Venta, Producto, Persona, Usuario, Caja, Movimiento, sq } from '../../libs/db.js'

/**
 * Función de utilidad para normalizar unidades (Misma lógica que en compras)
 */
const convertirAQuintales = (cantidad, unidadOrigen) => {
  const cant = parseFloat(cantidad)
  switch (unidadOrigen) {
    case 'Kilogramos':
      return cant / 45.36
    case 'Libras':
      return cant / 100
    case 'Quintales':
      return cant
    default:
      return cant
  }
}

const registrarVenta = async (data) => {
  const { venta, CajaId } = data
  const { CompradorId, UsuarioId, ProductoId, cantidadQuintales, unidadVenta } = venta

  // 1. Validaciones iniciales
  const [comprador, usuario, producto, caja] = await Promise.all([
    Persona.findOne({ where: { id: CompradorId } }),
    Usuario.findOne({ where: { id: UsuarioId } }),
    Producto.findOne({ where: { id: ProductoId } }),
    CajaId ? Caja.findOne({ where: { id: CajaId } }) : null,
  ])

  if (!comprador) return { code: 400, message: 'El comprador (cliente) no existe.' }
  if (!usuario) return { code: 400, message: 'Usuario (vendedor) no encontrado.' }
  if (!producto) return { code: 400, message: 'El producto no existe en el catálogo.' }
  if (!caja) return { code: 400, message: 'Debe existir una caja activa para procesar la venta.' }
  if (caja.estado !== 'Abierta') return { code: 400, message: 'La caja está cerrada.' }

  // 2. Validar Stock antes de iniciar la transacción
  const cantidadNormalizada = convertirAQuintales(cantidadQuintales, unidadVenta || 'Quintales')
  if (parseFloat(producto.stock) < cantidadNormalizada) {
    return {
      code: 400,
      message: `Stock insuficiente. Disponible: ${producto.stock} QQ. Intenta vender: ${cantidadNormalizada.toFixed(2)} QQ.`,
    }
  }

  const t = await sq.transaction()

  try {
    // 3. Crear el registro de la Venta
    const nuevaVenta = await Venta.create(
      {
        ...venta,
        // Forzamos que el montoPendiente sea la resta si no viene calculado
        montoPendiente: parseFloat(venta.totalFactura) - parseFloat(venta.montoAbonado),
      },
      { transaction: t }
    )

    // 4. DESCONTAR del Inventario
    await producto.update(
      { stock: parseFloat(producto.stock) - cantidadNormalizada },
      { transaction: t }
    )

    // 5. Movimiento de Caja e Ingreso de dinero
    const montoEfectivoIngresado = parseFloat(venta.montoAbonado)
    if (montoEfectivoIngresado > 0) {
      // Registrar el ingreso en la tabla Movimientos
      await Movimiento.create(
        {
          tipoMovimiento: 'Ingreso',
          categoria: 'Venta',
          monto: montoEfectivoIngresado,
          idReferencia: nuevaVenta.id,
          CajaId: CajaId,
        },
        { transaction: t }
      )

      // Actualizar el monto esperado de la caja (SUMAR el ingreso)
      await caja.update(
        { montoEsperado: parseFloat(caja.montoEsperado) + montoEfectivoIngresado },
        { transaction: t }
      )
    }

    await t.commit()

    return {
      code: 201,
      message: 'Venta realizada con éxito y stock actualizado.',
      id: nuevaVenta.id,
    }
  } catch (error) {
    await t.rollback()
    console.error('Error en registrarVenta:', error)
    return {
      code: 500,
      message: 'No se pudo procesar la venta.',
      error: error.message,
    }
  }
}

export { registrarVenta }
