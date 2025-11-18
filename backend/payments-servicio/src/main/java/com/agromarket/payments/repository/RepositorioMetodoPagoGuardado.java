package com.agromarket.payments.repository;

import com.agromarket.payments.domain.MetodoPagoGuardado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepositorioMetodoPagoGuardado extends JpaRepository<MetodoPagoGuardado, Long> {
  List<MetodoPagoGuardado> findByUsuarioAuthId(Long usuarioAuthId);
}

