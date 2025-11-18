package com.agromarket.notifications.repository;

import com.agromarket.notifications.domain.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepositorioNotificacion extends JpaRepository<Notificacion, Long> {
  List<Notificacion> findByDestinatario(String destinatario);
}

