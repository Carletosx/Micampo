package com.agromarket.productos.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class SolicitudActualizarProducto {
  @NotBlank
  @Size(max = 120)
  private String nombre;
  @Size(max = 500)
  private String descripcion;
  @NotNull
  @DecimalMin("0.0")
  private BigDecimal precio;
  @NotNull
  @Min(0)
  private Integer stock;
  @NotBlank
  @Pattern(regexp = "^(TUBERCULOS|VERDURAS|FRUTAS|GRANOS|LACTEOS|CARNES)$")
  private String categoria;
  private String imagenUrl;
}

