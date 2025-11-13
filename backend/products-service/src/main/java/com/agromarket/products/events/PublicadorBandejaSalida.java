package com.agromarket.products.events;

import com.agromarket.products.repo.BandejaSalidaRepositorio;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class PublicadorBandejaSalida {

  private final BandejaSalidaRepositorio outboxRepository;
  private final RabbitTemplate rabbitTemplate;

  @Value("${events.exchange.products:products.events}")
  private String productsExchangeName;

  public PublicadorBandejaSalida(BandejaSalidaRepositorio outboxRepository, RabbitTemplate rabbitTemplate) {
    this.outboxRepository = outboxRepository;
    this.rabbitTemplate = rabbitTemplate;
  }

  @Scheduled(fixedDelayString = "${outbox.publisher.delay-ms:2000}")
  public void publicarPendientes() {
    var pendientes = outboxRepository.findTop100ByPublicadoFalseOrderByCreadoEnAsc();
    for (var event : pendientes) {
      rabbitTemplate.convertAndSend(productsExchangeName, event.getRoutingKey(), event.getPayload());
      event.setPublicado(true);
      event.setPublicadoEn(Instant.now());
    }
    if (!pendientes.isEmpty()) {
      outboxRepository.saveAll(pendientes);
    }
  }
}
