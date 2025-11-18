package com.agromarket.orders.repository;

import com.agromarket.orders.domain.HistorialEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepositorioHistorialEstado extends JpaRepository<HistorialEstado, Long> {
  List<HistorialEstado> findByPedidoId(Long pedidoId);
}

