package com.agromarket.inventory.events;

import com.agromarket.inventory.service.ServicioInventario;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class ConsumidorEventos {
  private final ServicioInventario servicioInventario;
  public ConsumidorEventos(ServicioInventario servicioInventario) { this.servicioInventario = servicioInventario; }

  @RabbitListener(queues = "inventory.product.created.q")
  public void onProductoCreado(ProductoCreadoEvento evento) {
    servicioInventario.crearSiNoExiste(evento.getProductoId(), evento.getStock());
  }
}

