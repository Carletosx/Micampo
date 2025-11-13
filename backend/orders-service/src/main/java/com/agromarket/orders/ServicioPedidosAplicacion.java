package com.agromarket.orders;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ServicioPedidosAplicacion {
  public static void main(String[] args) {
    SpringApplication.run(ServicioPedidosAplicacion.class, args);
  }
}
