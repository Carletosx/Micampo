package com.agromarket.gateway.filter;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import reactor.core.publisher.Mono;

import java.security.Key;

@Component
public class JwtAuthFilter implements GlobalFilter, Ordered {
  @Value("${jwt.secreto}")
  private String secreto;

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    String path = exchange.getRequest().getPath().value();
    String method = exchange.getRequest().getMethod() != null ? exchange.getRequest().getMethod().name() : "";
    boolean isReviewEndpoint = path.startsWith("/api/products/") && path.contains("/resenas");
    boolean isPaymentsEndpoint = path.startsWith("/api/payments/");
    if (path.startsWith("/api/auth") || path.startsWith("/api/users/public") || path.startsWith("/files/") || (path.startsWith("/api/products") && "GET".equalsIgnoreCase(method))) {
      return chain.filter(exchange);
    }

    // Reseñas: si hay Authorization, inyectar cabeceras; si no hay, permitir invitado sin 401
    if (isReviewEndpoint) {
      String auth = exchange.getRequest().getHeaders().getFirst("Authorization");
      if (auth != null && auth.startsWith("Bearer ")) {
        String token = auth.substring(7);
        try {
          var jws = Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token);
          var claims = jws.getBody();
          String email = claims.getSubject();
          Object rol = claims.get("rol");
          Object usuarioId = claims.get("usuarioId");
          var mutated = exchange.getRequest().mutate()
            .header("X-Auth-Email", email != null ? email : "")
            .header("X-Auth-Rol", rol != null ? String.valueOf(rol) : "")
            .header("X-Auth-Id", usuarioId != null ? String.valueOf(usuarioId) : "")
            .header("X-Auth-Name", claims.get("nombre") != null ? String.valueOf(claims.get("nombre")) : "")
            .build();
          var newExchange = exchange.mutate().request(mutated).build();
          return chain.filter(newExchange);
        } catch (Exception e) {
          // Token inválido: tratar como invitado
          return chain.filter(exchange);
        }
      }
      // Invitado sin Authorization
      return chain.filter(exchange);
    }

    // Payments: permitir intents y webhooks sin exigir Authorization (Stripe webhook no envía token)
    if (isPaymentsEndpoint) {
      return chain.filter(exchange);
    }

    // Otros endpoints: exigir Authorization
    String auth = exchange.getRequest().getHeaders().getFirst("Authorization");
    if (auth == null || !auth.startsWith("Bearer ")) {
      exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
      return exchange.getResponse().setComplete();
    }
    String token = auth.substring(7);
    try {
      var jws = Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token);
      var claims = jws.getBody();
      String email = claims.getSubject();
      Object rol = claims.get("rol");
      Object usuarioId = claims.get("usuarioId");
      var mutated = exchange.getRequest().mutate()
        .header("X-Auth-Email", email != null ? email : "")
        .header("X-Auth-Rol", rol != null ? String.valueOf(rol) : "")
        .header("X-Auth-Id", usuarioId != null ? String.valueOf(usuarioId) : "")
        .header("X-Auth-Name", claims.get("nombre") != null ? String.valueOf(claims.get("nombre")) : "")
        .build();
      var newExchange = exchange.mutate().request(mutated).build();
      return chain.filter(newExchange);
    } catch (Exception e) {
      exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
      return exchange.getResponse().setComplete();
    }
  }

  private Key getKey() { return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secreto)); }

  @Override
  public int getOrder() { return -1; }
}
