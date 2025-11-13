package com.agromarket.notifications.repo;

import com.agromarket.notifications.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NotificacionRepositorio extends JpaRepository<Notificacion, UUID> {}
