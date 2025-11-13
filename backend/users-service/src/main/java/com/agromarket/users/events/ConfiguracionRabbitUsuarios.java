package com.agromarket.users.events;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfiguracionRabbitUsuarios {

  @Value("${events.exchange.users:users.events}")
  private String usersExchangeName;

  @Bean
  public TopicExchange usersExchange() {
    return new TopicExchange(usersExchangeName, true, false);
  }

  @Bean
  public Queue queueUsuarioRegistrado() {
    return new Queue("users.user-registered.q", true);
  }

  @Bean
  public Binding bindingUsuarioRegistrado(Queue queueUsuarioRegistrado, TopicExchange usersExchange) {
    return BindingBuilder.bind(queueUsuarioRegistrado).to(usersExchange).with("user.registered");
  }
}
