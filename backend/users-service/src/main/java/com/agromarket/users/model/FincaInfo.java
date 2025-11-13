package com.agromarket.users.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "finca_info")
@Getter
@Setter
public class FincaInfo {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @OneToOne
  @JoinColumn(name = "agricultor_id", nullable = false)
  private Agricultor agricultor;

  private String nombre;
  private String ubicacion;
  @Column(length = 2000)
  private String descripcion;
}
