package com.agromarket.inventory.events;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;

@Configuration
public class ConfiguracionRabbitInventario {

  @Value("${events.exchange.products:products.events}")
  private String productsExchangeName;

  @Value("${events.exchange.inventory:inventory.events}")
  private String inventoryExchangeName;

  @Bean
  public TopicExchange productsExchange() { return new TopicExchange(productsExchangeName, true, false); }

  @Bean
  public TopicExchange inventoryExchange() { return new TopicExchange(inventoryExchangeName, true, false); }

  @Bean
  public Queue queueProductoCreado() { return new Queue("inventory.product-created.q", true); }

  @Bean
  public Binding bindingProductoCreado(Queue queueProductoCreado, TopicExchange productsExchange) {
    return BindingBuilder.bind(queueProductoCreado).to(productsExchange).with("product.created");
  }
}
