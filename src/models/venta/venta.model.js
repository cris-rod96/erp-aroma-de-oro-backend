import { DataTypes } from 'sequelize'

const VentasModel = (sq) => {
  sq.define(
    'Venta',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      codigoVenta: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      // --- BLOQUE DE PESAJE AGRÍCOLA ---
      unidad: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['Quintales', 'Kilogramos', 'Libras', 'Unidades', 'Arroba'],
        defaultValue: 'Quintales',
      },
      cantidadBruta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      calificacion: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        comment: 'Porcentaje de humedad/calidad',
      },
      impurezas: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        comment: 'Porcentaje de impurezas',
      },
      descuentoMerma: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        comment: 'Peso fijo restado (ej: sacos)',
      },
      cantidadNeta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Peso final tras descuentos',
      },
      // --- BLOQUE FINANCIERO PRINCIPAL ---
      precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      totalFactura: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Subtotal (Cantidad Neta * Precio)',
      },
      // --- RETENCIONES (SRI / LOCAL) ---
      retencionConcepto: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Ej: Retención IR 1% o Código específico',
      },
      retencionPorcentaje: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      valorRetenido: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
        comment: 'Monto que se descuenta del pago por retención',
      },
      // --- AJUSTES Y CRUCE DE CUENTAS ---
      montoAnticipo: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        comment: 'Créditos previos que el cliente ya tenía',
      },
      totalALiquidar: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Dinero real final: (TotalFactura - ValorRetenido - MontoAnticipo)',
      },
      montoAbonado: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        comment: 'Efectivo/Transferencia que entra a caja hoy',
      },
      montoPendiente: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        comment: 'Saldo que queda debiendo (TotalALiquidar - MontoAbonado)',
      },
      tipoVenta: {
        type: DataTypes.ENUM,
        values: ['Contado', 'Crédito'],
        defaultValue: 'Contado',
      },
      // --- RELACIONES ---
      PersonaId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Personas', key: 'id' },
      },
      ProductoId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Productos', key: 'id' },
      },
      UsuarioId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Usuarios', key: 'id' },
      },
      CajaId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Cajas', key: 'id' },
      },
    },
    {
      timestamps: true,
      tableName: 'Ventas',
    }
  )
}

export default VentasModel
