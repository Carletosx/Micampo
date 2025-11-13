package com.agromarket.payments.events;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfiguracionRabbitPagos {

  @Value("${events.exchange.payments:payments.events}")
  private String paymentsExchangeName;

  @Bean
  public TopicExchange paymentsExchange() {
    return new TopicExchange(paymentsExchangeName, true, false);
  }
}
