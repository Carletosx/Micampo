package com.agromarket.notifications.dto;

import jakarta.validation.constraints.*;
import lombok.Getter; import lombok.Setter;

@Getter @Setter
public class SolicitudEmail {
  @NotBlank
  private String destinatario;
  private String asunto;
  @NotBlank
  private String contenido;
  private Long plantillaId;
}

