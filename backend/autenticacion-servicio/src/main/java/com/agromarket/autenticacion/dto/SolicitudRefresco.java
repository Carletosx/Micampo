package com.agromarket.autenticacion.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolicitudRefresco {
  @NotBlank
  private String tokenRefresco;
}
