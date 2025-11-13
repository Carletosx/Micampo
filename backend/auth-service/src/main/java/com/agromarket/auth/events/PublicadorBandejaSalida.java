package com.agromarket.auth.events;

import com.agromarket.auth.repo.BandejaSalidaRepositorio;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class PublicadorBandejaSalida {

  private final BandejaSalidaRepositorio outboxRepository;
  private final RabbitTemplate rabbitTemplate;

  @Value("${events.exchange.users:users.events}")
  private String usersExchangeName;

  public PublicadorBandejaSalida(BandejaSalidaRepositorio outboxRepository, RabbitTemplate rabbitTemplate) {
    this.outboxRepository = outboxRepository;
    this.rabbitTemplate = rabbitTemplate;
  }

  @Scheduled(fixedDelayString = "${outbox.publisher.delay-ms:2000}")
  public void publicarPendientes() {
    var pendientes = outboxRepository.findTop100ByPublishedFalseOrderByCreatedAtAsc();
    for (var event : pendientes) {
      rabbitTemplate.convertAndSend(usersExchangeName, event.getRoutingKey(), event.getPayload());
      event.setPublished(true);
      event.setPublishedAt(Instant.now());
    }
    if (!pendientes.isEmpty()) {
      outboxRepository.saveAll(pendientes);
    }
  }
}
