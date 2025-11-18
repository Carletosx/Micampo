package com.agromarket.payments.dto;

import jakarta.validation.constraints.*;
import lombok.Getter; import lombok.Setter;
import java.math.BigDecimal;

@Getter @Setter
public class SolicitudCrearPago {
  @NotNull
  private Long pedidoId;
  @NotNull @DecimalMin("0.0")
  private BigDecimal monto;
  @NotBlank
  private String moneda;
  @Pattern(regexp = "^(TARJETA|YAPE|PLIN)$")
  private String tipo;
  @Pattern(regexp = "^(SIM|STRIPE)$")
  private String pasarela;
}

