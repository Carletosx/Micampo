package com.agromarket.products;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ServicioProductosAplicacion {
  public static void main(String[] args) {
    SpringApplication.run(ServicioProductosAplicacion.class, args);
  }
}
