package com.agromarket.orders.repo;

import com.agromarket.orders.model.HistorialEstado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface HistorialEstadoRepositorio extends JpaRepository<HistorialEstado, UUID> {}
