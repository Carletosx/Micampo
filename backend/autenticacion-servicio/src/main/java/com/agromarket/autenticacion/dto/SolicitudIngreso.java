package com.agromarket.autenticacion.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolicitudIngreso {
  @Email
  @NotBlank
  private String correo;
  @NotBlank
  @Size(min = 6, max = 64)
  private String contrasenia;
}
