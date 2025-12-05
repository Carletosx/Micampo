package com.agromarket.autenticacion.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolicitudActualizarPerfil {
  @Size(min = 2, max = 80)
  private String nombre;
  @Size(max = 255)
  private String avatarUrl;
}

