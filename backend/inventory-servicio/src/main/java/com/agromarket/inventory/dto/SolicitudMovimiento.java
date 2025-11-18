package com.agromarket.inventory.dto;

import lombok.Getter; import lombok.Setter;
import jakarta.validation.constraints.Min; import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.Pattern;

@Getter @Setter
public class SolicitudMovimiento {
  @Pattern(regexp = "^(ENTRADA|SALIDA|AJUSTE)$")
  private String tipo;
  @Min(1)
  private Integer cantidad;
  private String nota;
}

