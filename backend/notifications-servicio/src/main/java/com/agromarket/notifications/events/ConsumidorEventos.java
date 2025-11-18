package com.agromarket.notifications.events;

import com.agromarket.notifications.domain.TipoNotificacion;
import com.agromarket.notifications.service.ServicioNotificaciones;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class ConsumidorEventos {
  private final ServicioNotificaciones servicio;
  public ConsumidorEventos(ServicioNotificaciones servicio) { this.servicio = servicio; }

  @RabbitListener(queues = "notifications.order.created.q")
  public void onOrderCreated(Object evento) { servicio.enviar(TipoNotificacion.INAPP, "todos", null, "Nuevo pedido creado"); }

  @RabbitListener(queues = "notifications.order.confirmed.q")
  public void onOrderConfirmed(Object evento) { servicio.enviar(TipoNotificacion.INAPP, "todos", null, "Pedido confirmado"); }

  @RabbitListener(queues = "notifications.order.status.q")
  public void onOrderStatus(Object evento) { servicio.enviar(TipoNotificacion.INAPP, "todos", null, "Estado de pedido actualizado"); }

  @RabbitListener(queues = "notifications.payment.approved.q")
  public void onPaymentApproved(Object evento) { servicio.enviar(TipoNotificacion.INAPP, "todos", null, "Pago aprobado"); }

  @RabbitListener(queues = "notifications.payment.failed.q")
  public void onPaymentFailed(Object evento) { servicio.enviar(TipoNotificacion.INAPP, "todos", null, "Pago fallido"); }

  @RabbitListener(queues = "notifications.inventory.stocklow.q")
  public void onStockLow(Object evento) { servicio.enviar(TipoNotificacion.INAPP, "todos", null, "Stock por debajo del mínimo"); }

  @RabbitListener(queues = "notifications.usuario.registrado.q")
  public void onUsuarioRegistrado(Object evento) { servicio.enviar(TipoNotificacion.INAPP, "todos", null, "Usuario registrado"); }
}

