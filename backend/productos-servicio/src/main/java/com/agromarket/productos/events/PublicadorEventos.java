package com.agromarket.productos.events;

import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PublicadorEventos {
  private final RabbitTemplate rabbitTemplate;
  private final TopicExchange intercambioProducto;
  @Value("${eventos.habilitados:true}")
  private boolean habilitado;

  public PublicadorEventos(RabbitTemplate rabbitTemplate, TopicExchange intercambioProducto) {
    this.rabbitTemplate = rabbitTemplate;
    this.intercambioProducto = intercambioProducto;
  }

  public void publicarProductoCreado(ProductoCreadoEvento evento) {
    if (!habilitado) return;
    try {
      rabbitTemplate.convertAndSend(intercambioProducto.getName(), EventosConfig.RK_PRODUCTO_CREADO, evento);
    } catch (AmqpException e) {
    }
  }
}

