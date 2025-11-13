package com.agromarket.products.repo;

import com.agromarket.products.model.ResenaProducto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ResenaProductoRepositorio extends JpaRepository<ResenaProducto, UUID> {}
