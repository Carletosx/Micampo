package com.agromarket.notifications.repository;

import com.agromarket.notifications.domain.PlantillaNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioPlantilla extends JpaRepository<PlantillaNotificacion, Long> {}

