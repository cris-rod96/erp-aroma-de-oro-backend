import { Caja, Movimiento } from '../../libs/db.js' // Importa tus movimientos
import { sq } from '../../libs/db.js' // Para usar funciones agregadas como SUM

const cerrarCaja = async (id, data) => {
  // Agregamos 'data' para recibir el montoReal
  const caja = await Caja.findByPk(id)

  if (!caja) return { code: 404, message: 'Caja no encontrada' }
  if (caja.estado === 'Cerrada') return { code: 400, message: 'La caja ya está cerrada' }

  // 1. Calculamos el total de Ingresos y Egresos de esta caja específica
  // Esto busca en la tabla de movimientos vinculados a este ID de caja
  const resultados = await Movimiento.findAll({
    attributes: ['tipoMovimiento', [sq.fn('SUM', sq.col('monto')), 'total']],
    where: { CajaId: id }, // Filtramos por esta sesión de caja
    group: ['tipoMovimiento'],
  })

  let ingresos = 0
  let egresos = 0

  resultados.forEach((res) => {
    const total = parseFloat(res.get('total'))
    if (res.tipoMovimiento === 'Ingreso') ingresos = total
    if (res.tipoMovimiento === 'Egreso') egresos = total
  })

  // 2. Calculamos el saldo que DEBERÍA haber según el sistema
  const saldoEsperado = parseFloat(caja.montoApertura) + ingresos - egresos

  // 3. Cerramos la caja con los cálculos
  await caja.update({
    fechaCierre: new Date(),
    montoCierre: data.montoFisico, // Lo que el cajero dice que hay
    estado: 'Cerrada',
    // Podrías guardar campos extra como:
    // saldoSistema: saldoEsperado,
    // diferencia: data.montoFisico - saldoEsperado
  })

  return {
    code: 200,
    message: 'Caja cerrada con éxito',
    resumen: {
      esperado: saldoEsperado,
      contado: data.montoFisico,
      diferencia: data.montoFisico - saldoEsperado,
    },
  }
}

export { cerrarCaja }
