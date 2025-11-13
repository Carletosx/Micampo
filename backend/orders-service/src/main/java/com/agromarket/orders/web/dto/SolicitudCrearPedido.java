package com.agromarket.orders.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record SolicitudCrearPedido(
    @NotBlank String metodoPago,
    @NotBlank String metodoEnvio,
    @NotNull BigDecimal costoEnvio,
    @NotNull BigDecimal descuento,
    @NotNull List<Item> items
) {
  public record Item(@NotNull UUID productoId, @NotNull @Min(1) Integer cantidad, @NotNull BigDecimal precioUnitario) {}
}
