package com.agromarket.auth.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfiguracionRabbit {

  @Value("${events.exchange.users:users.events}")
  private String usersExchangeName;

  @Bean
  public TopicExchange usersExchange() {
    return new TopicExchange(usersExchangeName, true, false);
  }
}
