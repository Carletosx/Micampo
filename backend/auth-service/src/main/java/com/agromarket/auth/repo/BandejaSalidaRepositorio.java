package com.agromarket.auth.repo;

import com.agromarket.auth.events.EventoBandejaSalida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BandejaSalidaRepositorio extends JpaRepository<EventoBandejaSalida, UUID> {
  List<EventoBandejaSalida> findTop100ByPublishedFalseOrderByCreatedAtAsc();
}
