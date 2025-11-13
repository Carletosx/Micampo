package com.agromarket.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ServicioInventarioAplicacion {
  public static void main(String[] args) {
    SpringApplication.run(ServicioInventarioAplicacion.class, args);
  }
}
