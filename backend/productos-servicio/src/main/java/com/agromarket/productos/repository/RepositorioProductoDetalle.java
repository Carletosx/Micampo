package com.agromarket.productos.repository;

import com.agromarket.productos.domain.ProductoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RepositorioProductoDetalle extends JpaRepository<ProductoDetalle, Long> {
  Optional<ProductoDetalle> findByProductoId(Long productoId);
}
