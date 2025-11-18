package com.agromarket.autenticacion.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;

@Service
public class ServicioJwt {
  @Value("${jwt.secreto}")
  private String secreto;

  public String generarAccessToken(String sujeto, String rol, long minutos) {
    Date ahora = new Date();
    Date exp = new Date(ahora.getTime() + minutos * 60_000);
    return Jwts.builder().setSubject(sujeto).claim("rol", rol).setIssuedAt(ahora).setExpiration(exp).signWith(llave(), SignatureAlgorithm.HS256).compact();
  }

  public String generarRefreshToken(String sujeto, long dias) {
    Date ahora = new Date();
    Date exp = new Date(ahora.getTime() + dias * 24L * 60L * 60L * 1000L);
    return Jwts.builder().setSubject(sujeto).setIssuedAt(ahora).setExpiration(exp).signWith(llave(), SignatureAlgorithm.HS256).compact();
  }

  public boolean esValido(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(llave()).build().parseClaimsJws(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  public String obtenerSujeto(String token) {
    Claims c = Jwts.parserBuilder().setSigningKey(llave()).build().parseClaimsJws(token).getBody();
    return c.getSubject();
  }

  private Key llave() {
    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secreto));
  }
}
