package com.agromarket.gateway.filters;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class FiltroRateLimitIp implements GlobalFilter, Ordered {

  private final ConcurrentHashMap<String, Deque<Long>> ventanas = new ConcurrentHashMap<>();
  private final int limite = 100;
  private final long ventanaMs = 60_000;

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    String ip = exchange.getRequest().getRemoteAddress() != null ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress() : "unknown";
    long ahora = Instant.now().toEpochMilli();
    Deque<Long> deque = ventanas.computeIfAbsent(ip, k -> new ArrayDeque<>());
    while (!deque.isEmpty() && ahora - deque.peekFirst() > ventanaMs) {
      deque.pollFirst();
    }
    if (deque.size() >= limite) {
      exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
      return exchange.getResponse().setComplete();
    }
    deque.addLast(ahora);
    return chain.filter(exchange);
  }

  @Override
  public int getOrder() {
    return -50;
  }
}
