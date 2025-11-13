package com.agromarket.payments.repo;

import com.agromarket.payments.model.MetodoPagoGuardado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MetodoPagoGuardadoRepositorio extends JpaRepository<MetodoPagoGuardado, UUID> {
  List<MetodoPagoGuardado> findByEmailUsuario(String emailUsuario);
}
