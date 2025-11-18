package com.agromarket.notifications.config;

import com.agromarket.notifications.events.EventosConfig;
import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfiguracionRabbitMQ {
  @Bean
  public TopicExchange intercambioOrden() { return new TopicExchange(EventosConfig.EXCHANGE_ORDEN); }
  @Bean
  public TopicExchange intercambioPago() { return new TopicExchange(EventosConfig.EXCHANGE_PAGO); }
  @Bean
  public TopicExchange intercambioInventario() { return new TopicExchange(EventosConfig.EXCHANGE_INVENTARIO); }
  @Bean
  public TopicExchange intercambioUsuario() { return new TopicExchange(EventosConfig.EXCHANGE_USUARIO); }

  @Bean
  public Queue qOrderCreated() { return new Queue("notifications.order.created.q", true); }
  @Bean
  public Queue qOrderConfirmed() { return new Queue("notifications.order.confirmed.q", true); }
  @Bean
  public Queue qOrderStatusChanged() { return new Queue("notifications.order.status.q", true); }
  @Bean
  public Queue qPaymentApproved() { return new Queue("notifications.payment.approved.q", true); }
  @Bean
  public Queue qPaymentFailed() { return new Queue("notifications.payment.failed.q", true); }
  @Bean
  public Queue qStockBajo() { return new Queue("notifications.inventory.stocklow.q", true); }
  @Bean
  public Queue qUsuarioRegistrado() { return new Queue("notifications.usuario.registrado.q", true); }

  @Bean
  public Binding bOrderCreated(Queue qOrderCreated, TopicExchange intercambioOrden) { return BindingBuilder.bind(qOrderCreated).to(intercambioOrden).with(EventosConfig.RK_ORDER_CREATED); }
  @Bean
  public Binding bOrderConfirmed(Queue qOrderConfirmed, TopicExchange intercambioOrden) { return BindingBuilder.bind(qOrderConfirmed).to(intercambioOrden).with(EventosConfig.RK_ORDER_CONFIRMED); }
  @Bean
  public Binding bOrderStatus(Queue qOrderStatusChanged, TopicExchange intercambioOrden) { return BindingBuilder.bind(qOrderStatusChanged).to(intercambioOrden).with(EventosConfig.RK_ORDER_STATUS_CHANGED); }
  @Bean
  public Binding bPaymentApproved(Queue qPaymentApproved, TopicExchange intercambioPago) { return BindingBuilder.bind(qPaymentApproved).to(intercambioPago).with(EventosConfig.RK_PAYMENT_APPROVED); }
  @Bean
  public Binding bPaymentFailed(Queue qPaymentFailed, TopicExchange intercambioPago) { return BindingBuilder.bind(qPaymentFailed).to(intercambioPago).with(EventosConfig.RK_PAYMENT_FAILED); }
  @Bean
  public Binding bStockBajo(Queue qStockBajo, TopicExchange intercambioInventario) { return BindingBuilder.bind(qStockBajo).to(intercambioInventario).with(EventosConfig.RK_STOCK_BAJO); }
  @Bean
  public Binding bUsuarioRegistrado(Queue qUsuarioRegistrado, TopicExchange intercambioUsuario) { return BindingBuilder.bind(qUsuarioRegistrado).to(intercambioUsuario).with(EventosConfig.RK_USUARIO_REGISTRADO); }

  @Bean
  public MessageConverter convertidorMensaje() { return new Jackson2JsonMessageConverter(); }
}

