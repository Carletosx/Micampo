package com.agromarket.usuarios.events;

import com.agromarket.usuarios.service.ServicioPerfiles;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class ConsumidorEventos {
  private final ServicioPerfiles servicioPerfiles;

  public ConsumidorEventos(ServicioPerfiles servicioPerfiles) {
    this.servicioPerfiles = servicioPerfiles;
  }

  @RabbitListener(queues = "users.usuario.registrado.q")
  public void onUsuarioRegistrado(UsuarioRegistradoEvento evento) {
    servicioPerfiles.onUsuarioRegistrado(evento);
  }
}

