package com.agromarket.notifications.events;

import com.agromarket.notifications.model.EstadoNotificacion;
import com.agromarket.notifications.model.Notificacion;
import com.agromarket.notifications.repo.NotificacionRepositorio;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ConsumidoresEventos {

  private final ObjectMapper mapper;
  private final NotificacionRepositorio notificacionRepositorio;

  public ConsumidoresEventos(ObjectMapper mapper, NotificacionRepositorio notificacionRepositorio) {
    this.mapper = mapper;
    this.notificacionRepositorio = notificacionRepositorio;
  }

  @RabbitListener(queues = "notifications.user-registered.q")
  public void onUserRegistered(String payload) throws Exception {
    Map<?,?> m = mapper.readValue(payload, Map.class);
    String email = (String) m.get("email");
    Notificacion n = new Notificacion();
    n.setTipo("EMAIL");
    n.setDestinatario(email);
    n.setMensaje("Bienvenido a AgroMarket: " + email);
    n.setEstado(EstadoNotificacion.ENVIADA);
    notificacionRepositorio.save(n);
  }

  @RabbitListener(queues = "notifications.order.q")
  public void onOrderEvents(String payload) throws Exception {
    Notificacion n = new Notificacion();
    n.setTipo("EMAIL");
    n.setDestinatario("comprador@agromarket");
    n.setMensaje("Actualización de pedido: " + payload);
    n.setEstado(EstadoNotificacion.ENVIADA);
    notificacionRepositorio.save(n);
  }

  @RabbitListener(queues = "notifications.payment.q")
  public void onPaymentEvents(String payload) throws Exception {
    Notificacion n = new Notificacion();
    n.setTipo("EMAIL");
    n.setDestinatario("comprador@agromarket");
    n.setMensaje("Estado de pago: " + payload);
    n.setEstado(EstadoNotificacion.ENVIADA);
    notificacionRepositorio.save(n);
  }

  @RabbitListener(queues = "notifications.inventory-low.q")
  public void onInventoryLow(String payload) throws Exception {
    Notificacion n = new Notificacion();
    n.setTipo("EMAIL");
    n.setDestinatario("agricultor@agromarket");
    n.setMensaje("Alerta de stock: " + payload);
    n.setEstado(EstadoNotificacion.ENVIADA);
    notificacionRepositorio.save(n);
  }
}
