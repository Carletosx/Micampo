package com.agromarket.inventory.dto;

import lombok.Getter; import lombok.Setter;
import jakarta.validation.constraints.Min;

@Getter @Setter
public class SolicitudActualizarInventario {
  @Min(0)
  private Integer stockMinimo;
  @Min(0)
  private Integer stockActual;
}

