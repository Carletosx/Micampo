package com.agromarket.orders.repo;

import com.agromarket.orders.model.EstadoPedido;
import com.agromarket.orders.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PedidoRepositorio extends JpaRepository<Pedido, UUID> {
  Optional<Pedido> findByNumero(String numero);
  List<Pedido> findByEstado(EstadoPedido estado);
}
