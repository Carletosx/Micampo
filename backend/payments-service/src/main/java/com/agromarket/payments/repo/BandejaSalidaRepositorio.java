package com.agromarket.payments.repo;

import com.agromarket.payments.events.EventoBandejaSalida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BandejaSalidaRepositorio extends JpaRepository<EventoBandejaSalida, UUID> {
  List<EventoBandejaSalida> findTop100ByPublicadoFalseOrderByCreadoEnAsc();
}
