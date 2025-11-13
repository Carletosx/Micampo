package com.agromarket.auth.security;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class ServicioJwtTest {

  @Test
  void generaYValidaToken() {
    ServicioJwt service = new ServicioJwt();
    ReflectionTestUtils.setField(service, "secreto", "MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE=");
    ReflectionTestUtils.setField(service, "minutosExpiracion", 5L);
    String token = service.generarToken("user@example.com", Map.of("roles", new String[]{"ROLE_COMPRADOR"}));
    assertNotNull(token);
    assertTrue(service.esTokenValido(token));
    assertEquals("user@example.com", service.extraerSujeto(token));
  }
}
