package com.agromarket.inventory.repository;

import com.agromarket.inventory.domain.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepositorioMovimientoInventario extends JpaRepository<MovimientoInventario, Long> {
  List<MovimientoInventario> findByProductoId(Long productoId);
}

