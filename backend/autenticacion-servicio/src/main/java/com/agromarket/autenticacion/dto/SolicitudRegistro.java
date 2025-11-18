package com.agromarket.autenticacion.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolicitudRegistro {
  @Email
  @NotBlank
  private String correo;
  @NotBlank
  @Size(min = 6, max = 64)
  private String contrasenia;
  @NotBlank
  @Pattern(regexp = "^(AGRICULTOR|COMPRADOR)$")
  private String rol;
}
