package com.agromarket.products.web.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record SolicitudResena(
    @Min(1) @Max(5) Integer calificacion,
    @NotBlank String comentario
) {}
