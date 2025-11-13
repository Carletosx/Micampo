package com.agromarket.payments.repo;

import com.agromarket.payments.model.TransaccionPasarela;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TransaccionPasarelaRepositorio extends JpaRepository<TransaccionPasarela, UUID> {}
