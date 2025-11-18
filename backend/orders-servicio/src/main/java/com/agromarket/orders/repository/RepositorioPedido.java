package com.agromarket.orders.repository;

import com.agromarket.orders.domain.Pedido;
import com.agromarket.orders.domain.EstadoPedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioPedido extends JpaRepository<Pedido, Long> {
  Page<Pedido> findByUsuarioAuthId(Long usuarioAuthId, Pageable pageable);
  Page<Pedido> findByAgricultorAuthId(Long agricultorAuthId, Pageable pageable);
  Page<Pedido> findByEstado(EstadoPedido estado, Pageable pageable);
}

