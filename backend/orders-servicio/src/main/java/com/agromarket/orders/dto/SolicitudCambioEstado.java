package com.agromarket.orders.dto;

import jakarta.validation.constraints.*;
import lombok.Getter; import lombok.Setter;

@Getter @Setter
public class SolicitudCambioEstado {
  @Pattern(regexp = "^(CONFIRMADO|EN_PREPARACION|EN_CAMINO|ENTREGADO|CANCELADO)$")
  private String estado;
  private String nota;
}

