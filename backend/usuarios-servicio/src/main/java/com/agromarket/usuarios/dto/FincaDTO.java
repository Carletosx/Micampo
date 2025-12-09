package com.agromarket.usuarios.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FincaDTO {
  private String nombre;
  private String ubicacion;
  private Double areaHa;
  private String certificacion;
  private String fotoUrl;
  private String videoUrl;
  private String descripcion;
}
