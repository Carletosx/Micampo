package com.agromarket.inventory.repo;

import com.agromarket.inventory.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InventarioRepositorio extends JpaRepository<Inventario, UUID> {
  Optional<Inventario> findByProductoId(UUID productoId);
}
