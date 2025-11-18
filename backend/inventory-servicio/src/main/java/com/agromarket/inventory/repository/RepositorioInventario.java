package com.agromarket.inventory.repository;

import com.agromarket.inventory.domain.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RepositorioInventario extends JpaRepository<Inventario, Long> {
  Optional<Inventario> findByProductoId(Long productoId);
}

