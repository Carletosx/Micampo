package com.agromarket.autenticacion.dto;

public record UsuarioRespuesta(Long id, String correo, String nombre, String rol, boolean activo, String avatarUrl) {}

