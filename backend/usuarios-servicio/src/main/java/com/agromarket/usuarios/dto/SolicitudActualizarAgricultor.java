package com.agromarket.usuarios.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolicitudActualizarAgricultor {
  @NotBlank
  private String nombre;
  @NotBlank
  @Pattern(regexp = "^[0-9]{9}$")
  private String telefono;
}
