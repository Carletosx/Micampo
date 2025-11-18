package com.agromarket.productos.config;

import com.agromarket.productos.events.EventosConfig;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfiguracionRabbitMQ {
  @Bean
  public TopicExchange intercambioProducto() {
    return new TopicExchange(EventosConfig.EXCHANGE_PRODUCTO);
  }

  @Bean
  public MessageConverter convertidorMensaje() {
    return new Jackson2JsonMessageConverter();
  }
}

