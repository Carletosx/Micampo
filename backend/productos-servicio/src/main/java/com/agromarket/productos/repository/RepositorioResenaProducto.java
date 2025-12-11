package com.agromarket.productos.repository;

import com.agromarket.productos.domain.ResenaProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RepositorioResenaProducto extends JpaRepository<ResenaProducto, Long> {
  List<ResenaProducto> findByProductoId(Long productoId);
  @org.springframework.data.jpa.repository.Query("select r from ResenaProducto r join Producto p on p.id = r.productoId where p.vendedorAuthId = :authId")
  List<ResenaProducto> findByVendedorAuthId(@org.springframework.data.repository.query.Param("authId") Long authId);
}
