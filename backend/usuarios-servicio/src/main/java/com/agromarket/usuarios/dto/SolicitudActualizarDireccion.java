package com.agromarket.usuarios.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;

@Getter
@Setter
public class SolicitudActualizarDireccion {
  @Pattern(regexp = "^(CASA|OFICINA)$")
  private String tipo;
  private String linea1;
  private String linea2;
  private String distrito;
  private String provincia;
  private String departamento;
  private String referencia;
  @DecimalMin("-90.0")
  @DecimalMax("90.0")
  private Double latitud;
  @DecimalMin("-180.0")
  @DecimalMax("180.0")
  private Double longitud;
}
