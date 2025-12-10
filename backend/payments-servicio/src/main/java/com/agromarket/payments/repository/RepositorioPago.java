package com.agromarket.payments.repository;

import com.agromarket.payments.domain.Pago;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioPago extends JpaRepository<Pago, Long> {
  java.util.Optional<Pago> findByTransaccionId(String transaccionId);
}
