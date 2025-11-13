package com.agromarket.products.events;

import java.util.UUID;
import java.math.BigDecimal;

public record EventoProductoCreado(
    UUID id,
    String nombre,
    BigDecimal precio,
    Integer stock,
    String categoria
) {}
