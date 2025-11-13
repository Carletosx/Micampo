package com.agromarket.products.repo;

import com.agromarket.products.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ProductoRepositorio extends JpaRepository<Producto, UUID> {

  @Query("select p from Producto p where (:q is null or lower(p.nombre) like lower(concat('%',:q,'%'))) and (:catId is null or p.categoria.id = :catId) and (:min is null or p.precio >= :min) and (:max is null or p.precio <= :max)")
  List<Producto> buscar(@Param("q") String q, @Param("catId") UUID categoriaId, @Param("min") BigDecimal min, @Param("max") BigDecimal max);
}
