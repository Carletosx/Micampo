package com.agromarket.orders.dto;

import jakarta.validation.constraints.*;
import lombok.Getter; import lombok.Setter;
import java.util.List; import java.math.BigDecimal;

@Getter @Setter
public class SolicitudCrearPedido {
  private Long usuarioAuthId;
  private Long agricultorAuthId;
  @NotBlank
  private String metodoPago;
  @NotBlank
  private String metodoEnvio;
  @NotEmpty
  private List<Item> items;

  @Getter @Setter
  public static class Item {
    @NotNull
    private Long productoId;
    @NotBlank
    private String nombreProducto;
    @NotNull @Min(1)
    private Integer cantidad;
    @NotNull @DecimalMin("0.0")
    private BigDecimal precioUnitario;
  }
}
