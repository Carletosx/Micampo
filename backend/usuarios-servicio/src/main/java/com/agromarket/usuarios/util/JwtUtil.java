package com.agromarket.usuarios.util;

import java.util.Base64;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JwtUtil {
  private static final ObjectMapper MAPPER = new ObjectMapper();
  @SuppressWarnings("unchecked")
  public static Map<String, Object> decodePayload(String jwt) {
    try {
      String[] parts = jwt.split("\\.");
      if (parts.length < 2) return null;
      String json = new String(Base64.getUrlDecoder().decode(parts[1]));
      return MAPPER.readValue(json, Map.class);
    } catch (Exception e) {
      return null;
    }
  }

  public static Long getUsuarioId(String jwt) {
    Map<String, Object> claims = decodePayload(jwt);
    if (claims == null) return null;
    Object v = claims.get("usuarioId");
    if (v instanceof Number) return ((Number) v).longValue();
    try { return v != null ? Long.parseLong(v.toString()) : null; } catch (Exception e) { return null; }
  }
}
