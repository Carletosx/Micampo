package com.agromarket.inventory.events;

import com.agromarket.inventory.model.Inventario;
import com.agromarket.inventory.repo.InventarioRepositorio;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Component
public class ConsumidorProductoCreado {

  private final ObjectMapper mapper;
  private final InventarioRepositorio inventarioRepositorio;

  public ConsumidorProductoCreado(ObjectMapper mapper, InventarioRepositorio inventarioRepositorio) {
    this.mapper = mapper;
    this.inventarioRepositorio = inventarioRepositorio;
  }

  @RabbitListener(queues = "inventory.product-created.q")
  public void onMessage(String payload) throws Exception {
    Map<?,?> m = mapper.readValue(payload, Map.class);
    UUID id = UUID.fromString((String) m.get("id"));
    inventarioRepositorio.findByProductoId(id).orElseGet(() -> {
      Inventario inv = new Inventario();
      inv.setProductoId(id);
      inv.setStockActual(0);
      inv.setStockMinimo(0);
      inv.setStockReservado(0);
      return inventarioRepositorio.save(inv);
    });
  }
}
