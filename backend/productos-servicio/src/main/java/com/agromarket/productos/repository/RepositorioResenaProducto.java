package com.agromarket.productos.repository;

import com.agromarket.productos.domain.ResenaProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepositorioResenaProducto extends JpaRepository<ResenaProducto, Long> {
  List<ResenaProducto> findByProductoId(Long productoId);
}

