package com.agromarket.usuarios.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolicitudActualizarComprador {
  @NotBlank
  private String nombre;
  @NotBlank
  @Pattern(regexp = "^[0-9]{9}$")
  private String telefono;
  @NotBlank
  @Pattern(regexp = "^(MINORISTA|MAYORISTA)$")
  private String tipo;
}
