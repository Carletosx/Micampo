package com.agromarket.inventory.config;

import com.agromarket.inventory.events.EventosConfig;
import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfiguracionRabbitMQ {
  @Bean
  public TopicExchange intercambioProducto() { return new TopicExchange(EventosConfig.EXCHANGE_PRODUCTO); }

  @Bean
  public TopicExchange intercambioInventario() { return new TopicExchange(EventosConfig.EXCHANGE_INVENTARIO); }

  @Bean
  public Queue colaProductoCreado() { return new Queue("inventory.product.created.q", true); }

  @Bean
  public Binding bindingProductoCreado(Queue colaProductoCreado, TopicExchange intercambioProducto) {
    return BindingBuilder.bind(colaProductoCreado).to(intercambioProducto).with(EventosConfig.RK_PRODUCTO_CREADO);
  }

  @Bean
  public MessageConverter convertidorMensaje() { return new Jackson2JsonMessageConverter(); }
}

