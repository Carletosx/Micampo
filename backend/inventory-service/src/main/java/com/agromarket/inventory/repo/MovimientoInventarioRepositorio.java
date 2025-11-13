package com.agromarket.inventory.repo;

import com.agromarket.inventory.model.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MovimientoInventarioRepositorio extends JpaRepository<MovimientoInventario, UUID> {
  List<MovimientoInventario> findByProductoIdOrderByCreadoEnDesc(UUID productoId);
}
