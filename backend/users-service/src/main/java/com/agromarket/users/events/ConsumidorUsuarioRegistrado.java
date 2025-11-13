package com.agromarket.users.events;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.agromarket.users.model.Agricultor;
import com.agromarket.users.model.Comprador;
import com.agromarket.users.repo.AgricultorRepositorio;
import com.agromarket.users.repo.CompradorRepositorio;

import java.util.Map;
import java.util.UUID;

@Component
public class ConsumidorUsuarioRegistrado {

  private final ObjectMapper mapper;
  private final AgricultorRepositorio agricultorRepositorio;
  private final CompradorRepositorio compradorRepositorio;

  public ConsumidorUsuarioRegistrado(ObjectMapper mapper, AgricultorRepositorio agricultorRepositorio, CompradorRepositorio compradorRepositorio) {
    this.mapper = mapper;
    this.agricultorRepositorio = agricultorRepositorio;
    this.compradorRepositorio = compradorRepositorio;
  }

  @RabbitListener(queues = "users.user-registered.q")
  public void onMessage(String payload) throws Exception {
    Map<?,?> m = mapper.readValue(payload, Map.class);
    UUID id = UUID.fromString((String) m.get("id"));
    String email = (String) m.get("email");
    String role = (String) m.get("role");
    if ("AGRICULTOR".equals(role)) {
      agricultorRepositorio.findByAuthUserId(id).orElseGet(() -> {
        Agricultor a = new Agricultor();
        a.setAuthUserId(id);
        a.setEmail(email);
        return agricultorRepositorio.save(a);
      });
    } else {
      compradorRepositorio.findByAuthUserId(id).orElseGet(() -> {
        Comprador c = new Comprador();
        c.setAuthUserId(id);
        c.setEmail(email);
        return compradorRepositorio.save(c);
      });
    }
  }
}
