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
public class StockBajoEvento {
  private String idEvento;
  private Instant fecha;
  private String claveEnrutamiento;
  private Long productoId;
  private Integer stockActual;
  private Integer stockMinimo;
  private String nivel;
}

