package com.agromarket.orders.events;

import com.agromarket.orders.service.ServicioPedidos;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

@Component
@ConditionalOnProperty(name = "eventos.habilitados", havingValue = "true")
public class ConsumidorPagos {
  private final ServicioPedidos servicioPedidos;
  public ConsumidorPagos(ServicioPedidos servicioPedidos) { this.servicioPedidos = servicioPedidos; }

  @RabbitListener(queues = "orders.payment.approved.q")
  public void onPaymentApproved(PaymentApprovedEvento evento) { servicioPedidos.onPaymentApproved(evento.getPedidoId()); }

  @RabbitListener(queues = "orders.payment.failed.q")
  public void onPaymentFailed(PaymentFailedEvento evento) { servicioPedidos.onPaymentFailed(evento.getPedidoId()); }
}
