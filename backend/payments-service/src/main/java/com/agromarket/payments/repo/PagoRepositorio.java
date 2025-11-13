package com.agromarket.payments.repo;

import com.agromarket.payments.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PagoRepositorio extends JpaRepository<Pago, UUID> {}
