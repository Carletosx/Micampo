package com.agromarket.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record SolicitudRefresco(
    @NotBlank String refreshToken
) {}
