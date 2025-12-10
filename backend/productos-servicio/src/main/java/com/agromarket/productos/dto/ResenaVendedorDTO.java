package com.agromarket.productos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResenaVendedorDTO {
  private Long id;
  private Long productoId;
  private String productoNombre;
  private Integer calificacion;
  private String comentario;
  private Long autorAuthId;
  private String autorNombre;
}
