package com.agromarket.products.repo;

import com.agromarket.products.model.ImagenProducto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ImagenProductoRepositorio extends JpaRepository<ImagenProducto, UUID> {}
