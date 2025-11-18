package com.agromarket.orders.repository;

import com.agromarket.orders.domain.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepositorioItemPedido extends JpaRepository<ItemPedido, Long> {
  List<ItemPedido> findByPedidoId(Long pedidoId);
}

