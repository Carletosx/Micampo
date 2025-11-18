package com.agromarket.productos.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductoCreadoEvento extends EventoBase {
  private Long productoId;
  private String nombre;
  private String categoria;
  private Integer stock;
}

