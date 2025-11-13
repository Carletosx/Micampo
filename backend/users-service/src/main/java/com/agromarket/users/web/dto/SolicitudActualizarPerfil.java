package com.agromarket.users.web.dto;

public record SolicitudActualizarPerfil(
    String nombres,
    String apellidos,
    String telefono,
    String compradorTipo
) {}
