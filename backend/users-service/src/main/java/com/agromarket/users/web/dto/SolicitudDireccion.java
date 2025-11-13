package com.agromarket.users.web.dto;

public record SolicitudDireccion(
    String etiqueta,
    String direccionCompleta,
    String ciudad,
    String departamento,
    String distrito,
    String referencia
) {}
