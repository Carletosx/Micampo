package com.agromarket.orders.events;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfiguracionRabbitPedidos {

  @Value("${events.exchange.orders:orders.events}")
  private String ordersExchangeName;

  @Bean
  public TopicExchange ordersExchange() {
    return new TopicExchange(ordersExchangeName, true, false);
  }
}
