package com.agromarket.usuarios.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolicitudCrearDireccion {
  @NotBlank
  @Pattern(regexp = "^(CASA|OFICINA)$")
  private String tipo;
  @NotBlank
  private String linea1;
  private String linea2;
  @NotBlank
  private String distrito;
  @NotBlank
  private String provincia;
  @NotBlank
  private String departamento;
  private String referencia;
  @DecimalMin("-90.0")
  @DecimalMax("90.0")
  private Double latitud;
  @DecimalMin("-180.0")
  @DecimalMax("180.0")
  private Double longitud;
}
