package com.agromarket.orders.repo;

import com.agromarket.orders.model.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ItemPedidoRepositorio extends JpaRepository<ItemPedido, UUID> {}
