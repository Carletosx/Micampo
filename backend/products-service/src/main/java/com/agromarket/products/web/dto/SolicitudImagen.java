package com.agromarket.products.web.dto;

import jakarta.validation.constraints.NotBlank;

public record SolicitudImagen(
    @NotBlank String url
) {}
