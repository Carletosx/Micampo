package com.agromarket.auth.dto;

import com.agromarket.auth.model.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SolicitudRegistro(
    @Email @NotBlank String email,
    @NotBlank String password,
    @NotNull Rol role
) {}
