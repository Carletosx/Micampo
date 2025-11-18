package com.agromarket.productos.repository;

import com.agromarket.productos.domain.Producto;
import com.agromarket.productos.domain.Categoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioProducto extends JpaRepository<Producto, Long> {
  Page<Producto> findByActivoTrue(Pageable pageable);
  Page<Producto> findByActivoTrueAndCategoria(Categoria categoria, Pageable pageable);
  Page<Producto> findByActivoTrueAndNombreContainingIgnoreCase(String nombre, Pageable pageable);
  Page<Producto> findByActivoTrueAndCategoriaAndNombreContainingIgnoreCase(Categoria categoria, String nombre, Pageable pageable);
}

