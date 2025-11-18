package com.agromarket.inventory.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductoCreadoEvento {
  private String idEvento;
  private Instant fecha;
  private String claveEnrutamiento;
  private Long productoId;
  private String nombre;
  private String categoria;
  private Integer stock;
}

