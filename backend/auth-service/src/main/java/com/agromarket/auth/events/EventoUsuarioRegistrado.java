package com.agromarket.auth.events;

import java.util.UUID;

public record EventoUsuarioRegistrado(
    UUID id,
    String email,
    String role
) {}
