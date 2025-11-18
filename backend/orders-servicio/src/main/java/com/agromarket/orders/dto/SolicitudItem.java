package com.agromarket.orders.dto;

import jakarta.validation.constraints.*;
import lombok.Getter; import lombok.Setter;
import java.math.BigDecimal;

@Getter @Setter
public class SolicitudItem {
  @NotNull
  private Long productoId;
  @NotBlank
  private String nombreProducto;
  @NotNull @Min(1)
  private Integer cantidad;
  @NotNull @DecimalMin("0.0")
  private BigDecimal precioUnitario;
}

