package com.agromarket.inventory.web.dto;

import jakarta.validation.constraints.Min;

public record SolicitudActualizarStock(
    @Min(0) Integer stockActual,
    @Min(0) Integer stockMinimo
) {}
