package com.agromarket.payments.config;

import com.agromarket.payments.events.EventosConfig;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfiguracionRabbitMQ {
  @Bean
  public TopicExchange intercambioPago() { return new TopicExchange(EventosConfig.EXCHANGE_PAGO); }
  @Bean
  public MessageConverter convertidorMensaje() { return new Jackson2JsonMessageConverter(); }
}

