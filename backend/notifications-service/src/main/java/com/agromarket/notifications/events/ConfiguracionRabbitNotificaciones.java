package com.agromarket.notifications.events;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfiguracionRabbitNotificaciones {

  @Value("${events.exchange.users:users.events}")
  private String usersExchangeName;

  @Value("${events.exchange.orders:orders.events}")
  private String ordersExchangeName;

  @Value("${events.exchange.payments:payments.events}")
  private String paymentsExchangeName;

  @Value("${events.exchange.inventory:inventory.events}")
  private String inventoryExchangeName;

  @Bean public TopicExchange usersExchange() { return new TopicExchange(usersExchangeName, true, false); }
  @Bean public TopicExchange ordersExchange() { return new TopicExchange(ordersExchangeName, true, false); }
  @Bean public TopicExchange paymentsExchange() { return new TopicExchange(paymentsExchangeName, true, false); }
  @Bean public TopicExchange inventoryExchange() { return new TopicExchange(inventoryExchangeName, true, false); }

  @Bean public Queue qUserRegistered() { return new Queue("notifications.user-registered.q", true); }
  @Bean public Queue qOrderEvents() { return new Queue("notifications.order.q", true); }
  @Bean public Queue qPaymentEvents() { return new Queue("notifications.payment.q", true); }
  @Bean public Queue qInventoryLow() { return new Queue("notifications.inventory-low.q", true); }

  @Bean public Binding bUserRegistered(Queue qUserRegistered, TopicExchange usersExchange) { return BindingBuilder.bind(qUserRegistered).to(usersExchange).with("user.registered"); }
  @Bean public Binding bOrderEvents(Queue qOrderEvents, TopicExchange ordersExchange) { return BindingBuilder.bind(qOrderEvents).to(ordersExchange).with("order.*"); }
  @Bean public Binding bPaymentEvents(Queue qPaymentEvents, TopicExchange paymentsExchange) { return BindingBuilder.bind(qPaymentEvents).to(paymentsExchange).with("payment.*"); }
  @Bean public Binding bInventoryLow(Queue qInventoryLow, TopicExchange inventoryExchange) { return BindingBuilder.bind(qInventoryLow).to(inventoryExchange).with("inventory.stock-low"); }
}
