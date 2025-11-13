package com.agromarket.inventory.web.dto;

import jakarta.validation.constraints.Min;

public record SolicitudReserva(
    @Min(1) Integer cantidad,
    String referencia
) {}
