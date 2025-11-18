package com.agromarket.orders.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PedidoCreadoEvento extends EventoBase {
  private Long pedidoId;
  private Long usuarioAuthId;
  private List<Item> items;

  public static class Item {
    public Long productoId;
    public Integer cantidad;
  }
}

