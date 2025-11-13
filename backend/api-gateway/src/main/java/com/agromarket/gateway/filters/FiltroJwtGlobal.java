package com.agromarket.gateway.filters;

import com.agromarket.gateway.security.UtilJwtGateway;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class FiltroJwtGlobal implements GlobalFilter, Ordered {

  private final UtilJwtGateway utilJwtGateway;

  public FiltroJwtGlobal(UtilJwtGateway utilJwtGateway) {
    this.utilJwtGateway = utilJwtGateway;
  }

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    String path = exchange.getRequest().getURI().getPath();
    if (path.startsWith("/auth/")) {
      return chain.filter(exchange);
    }
    String auth = exchange.getRequest().getHeaders().getFirst("Authorization");
    if (auth == null || !auth.startsWith("Bearer ")) {
      exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
      return exchange.getResponse().setComplete();
    }
    String token = auth.substring(7);
    if (!utilJwtGateway.esValido(token)) {
      exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
      return exchange.getResponse().setComplete();
    }
    var claims = utilJwtGateway.claims(token);
    ServerHttpRequest mutated = exchange.getRequest().mutate()
        .header("X-Usuario-Email", claims.getSubject())
        .header("X-Usuario-Roles", String.valueOf(claims.get("roles")))
        .build();
    return chain.filter(exchange.mutate().request(mutated).build());
  }

  @Override
  public int getOrder() {
    return -100;
  }
}
