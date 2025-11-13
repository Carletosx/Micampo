package com.agromarket.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ServicioAutenticacionAplicacion {
  public static void main(String[] args) {
    SpringApplication.run(ServicioAutenticacionAplicacion.class, args);
  }
}
