package com.agromarket.usuarios.repository;

import com.agromarket.usuarios.domain.FincaInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RepositorioFincaInfo extends JpaRepository<FincaInfo, Long> {
  Optional<FincaInfo> findByAgricultorId(Long agricultorId);
}

