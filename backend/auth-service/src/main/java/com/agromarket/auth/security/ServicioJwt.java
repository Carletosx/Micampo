package com.agromarket.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class ServicioJwt {

  @Value("${security.jwt.secret}")
  private String secreto;

  @Value("${security.jwt.exp-minutes:30}")
  private long minutosExpiracion;

  public String generarToken(String sujeto, Map<String, Object> claims) {
    Instant ahora = Instant.now();
    Instant exp = ahora.plusSeconds(minutosExpiracion * 60);
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(sujeto)
        .setIssuedAt(Date.from(ahora))
        .setExpiration(Date.from(exp))
        .signWith(llave(), SignatureAlgorithm.HS256)
        .compact();
  }

  public String extraerSujeto(String token) {
    return parsearClaims(token).getSubject();
  }

  public boolean esTokenValido(String token) {
    try {
      Claims claims = parsearClaims(token);
      return claims.getExpiration().after(new Date());
    } catch (Exception e) {
      return false;
    }
  }

  private Claims parsearClaims(String token) {
    return Jwts.parserBuilder().setSigningKey(llave()).build().parseClaimsJws(token).getBody();
  }

  private Key llave() {
    byte[] bytes = Decoders.BASE64.decode(secreto);
    return Keys.hmacShaKeyFor(bytes);
  }
}
