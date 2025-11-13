package com.agromarket.gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class UtilJwtGateway {

  @Value("${security.jwt.secret}")
  private String secreto;

  public boolean esValido(String token) {
    try {
      parsear(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  public Claims claims(String token) {
    return parsear(token);
  }

  private Claims parsear(String token) {
    return Jwts.parserBuilder().setSigningKey(llave()).build().parseClaimsJws(token).getBody();
  }

  private Key llave() {
    byte[] bytes = Decoders.BASE64.decode(secreto);
    return Keys.hmacShaKeyFor(bytes);
  }
}
