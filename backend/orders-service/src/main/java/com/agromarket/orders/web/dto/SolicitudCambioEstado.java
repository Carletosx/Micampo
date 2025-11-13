package com.agromarket.orders.web.dto;

import com.agromarket.orders.model.EstadoPedido;
import jakarta.validation.constraints.NotNull;

public record SolicitudCambioEstado(@NotNull EstadoPedido estado) {}
