package com.agromarket.usuarios.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolicitudActualizarFinca {
  @NotBlank
  @Size(max = 120)
  private String nombre;
  @NotBlank
  @Size(max = 200)
  private String ubicacion;
  @NotBlank
  @Size(max = 500)
  private String descripcion;
}
