package com.agromarket.products.events;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfiguracionRabbitProductos {

  @Value("${events.exchange.products:products.events}")
  private String productsExchangeName;

  @Bean
  public TopicExchange productsExchange() {
    return new TopicExchange(productsExchangeName, true, false);
  }
}
