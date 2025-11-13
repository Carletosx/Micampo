package com.agromarket.auth.dto;

public record RespuestaToken(
    String accessToken,
    String refreshToken
) {}
