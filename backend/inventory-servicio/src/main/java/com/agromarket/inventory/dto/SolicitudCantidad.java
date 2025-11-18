package com.agromarket.inventory.dto;

import lombok.Getter; import lombok.Setter;
import jakarta.validation.constraints.Min;

@Getter @Setter
public class SolicitudCantidad {
  @Min(1)
  private Integer cantidad;
}

