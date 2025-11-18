package com.agromarket.autenticacion.config;

import com.agromarket.autenticacion.events.EventosConfig;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfiguracionRabbitMQ {
  @Bean
  public TopicExchange intercambioUsuario() {
    return new TopicExchange(EventosConfig.EXCHANGE_USUARIO);
  }

  @Bean
  public MessageConverter convertidorMensaje() {
    return new Jackson2JsonMessageConverter();
  }
}
