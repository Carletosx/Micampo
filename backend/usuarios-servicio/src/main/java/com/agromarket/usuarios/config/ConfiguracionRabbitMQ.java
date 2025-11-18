package com.agromarket.usuarios.config;

import com.agromarket.usuarios.events.EventosConfig;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
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
  public Queue colaUsuarioRegistrado() {
    return new Queue("users.usuario.registrado.q", true);
  }

  @Bean
  public Binding bindingUsuarioRegistrado(Queue colaUsuarioRegistrado, TopicExchange intercambioUsuario) {
    return BindingBuilder.bind(colaUsuarioRegistrado).to(intercambioUsuario).with(EventosConfig.RK_USUARIO_REGISTRADO);
  }

  @Bean
  public MessageConverter convertidorMensaje() {
    return new Jackson2JsonMessageConverter();
  }
}

