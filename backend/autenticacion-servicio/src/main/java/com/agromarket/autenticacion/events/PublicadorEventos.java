package com.agromarket.autenticacion.events;

import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PublicadorEventos {
  private final RabbitTemplate rabbitTemplate;
  private final TopicExchange intercambioUsuario;
  @Value("${eventos.habilitados:true}")
  private boolean habilitado;

  public PublicadorEventos(RabbitTemplate rabbitTemplate, TopicExchange intercambioUsuario) {
    this.rabbitTemplate = rabbitTemplate;
    this.intercambioUsuario = intercambioUsuario;
  }

  public void publicarUsuarioRegistrado(UsuarioRegistradoEvento evento) {
    if (!habilitado) return;
    try {
      rabbitTemplate.convertAndSend(intercambioUsuario.getName(), EventosConfig.RK_USUARIO_REGISTRADO, evento);
    } catch (AmqpException e) {
    }
  }
}
