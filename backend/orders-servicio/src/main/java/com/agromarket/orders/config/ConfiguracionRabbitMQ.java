package com.agromarket.orders.config;

import com.agromarket.orders.events.EventosConfig;
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
  public TopicExchange intercambioPago() { return new TopicExchange(EventosConfig.EXCHANGE_PAYMENT); }
  @Bean
  public Queue colaPagoAprobado() { return new Queue("orders.payment.approved.q", true); }
  @Bean
  public Queue colaPagoFallido() { return new Queue("orders.payment.failed.q", true); }
  @Bean
  public Binding bindingPagoAprobado(Queue colaPagoAprobado, TopicExchange intercambioPago) { return BindingBuilder.bind(colaPagoAprobado).to(intercambioPago).with(EventosConfig.RK_PAYMENT_APPROVED); }
  @Bean
  public Binding bindingPagoFallido(Queue colaPagoFallido, TopicExchange intercambioPago) { return BindingBuilder.bind(colaPagoFallido).to(intercambioPago).with(EventosConfig.RK_PAYMENT_FAILED); }
  @Bean
  public MessageConverter convertidorMensaje() { return new Jackson2JsonMessageConverter(); }
}

