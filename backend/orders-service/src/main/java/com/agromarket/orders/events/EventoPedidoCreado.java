package com.agromarket.orders.events;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record EventoPedidoCreado(
    UUID id,
    String numero,
    BigDecimal subtotal,
    BigDecimal costoEnvio,
    BigDecimal descuento,
    BigDecimal total,
    List<Item> items
) {
  public record Item(UUID productoId, Integer cantidad, BigDecimal precioUnitario, BigDecimal subtotal) {}
}
