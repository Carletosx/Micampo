package com.agromarket.notifications.dto;

import jakarta.validation.constraints.*;
import lombok.Getter; import lombok.Setter;

@Getter @Setter
public class SolicitudSMS {
  @NotBlank
  private String destinatario;
  @NotBlank
  private String contenido;
  private Long plantillaId;
}

