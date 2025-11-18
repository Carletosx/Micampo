package com.agromarket.payments.dto;

import jakarta.validation.constraints.*;
import lombok.Getter; import lombok.Setter;

@Getter @Setter
public class SolicitudMetodoPagoGuardado {
  @NotNull
  private Long usuarioAuthId;
  @NotBlank
  private String token;
  private String last4;
  private String marca;
  private Integer expMonth;
  private Integer expYear;
}

