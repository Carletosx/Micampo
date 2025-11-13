package com.agromarket.orders.events;

import com.agromarket.orders.model.EstadoPedido;
import java.util.UUID;

public record EventoEstadoPedidoCambiado(
    UUID id,
    String numero,
    EstadoPedido estado
) {}
