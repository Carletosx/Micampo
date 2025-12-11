package com.agromarket.productos.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolicitudCrearResena {
  @NotNull
  @Min(1)
  @Max(5)
  private Integer calificacion;
  @Size(max = 500)
  private String comentario;
  private Long autorAuthId;
  private String autorNombre;
}
