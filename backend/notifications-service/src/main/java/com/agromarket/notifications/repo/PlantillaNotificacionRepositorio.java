package com.agromarket.notifications.repo;

import com.agromarket.notifications.model.PlantillaNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PlantillaNotificacionRepositorio extends JpaRepository<PlantillaNotificacion, UUID> {
  Optional<PlantillaNotificacion> findByNombre(String nombre);
}
