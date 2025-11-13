CREATE DATABASE IF NOT EXISTS users_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE users_db;

CREATE TABLE IF NOT EXISTS agricultor (
  id CHAR(36) PRIMARY KEY,
  auth_user_id CHAR(36) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  nombres VARCHAR(255),
  apellidos VARCHAR(255),
  telefono VARCHAR(64),
  calificacion DOUBLE DEFAULT 0,
  ventas INT DEFAULT 0,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS finca_info (
  id CHAR(36) PRIMARY KEY,
  agricultor_id CHAR(36) NOT NULL,
  nombre VARCHAR(255),
  ubicacion VARCHAR(255),
  descripcion TEXT,
  CONSTRAINT fk_finca_agricultor FOREIGN KEY (agricultor_id) REFERENCES agricultor(id)
);

CREATE TABLE IF NOT EXISTS comprador (
  id CHAR(36) PRIMARY KEY,
  auth_user_id CHAR(36) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  nombres VARCHAR(255),
  apellidos VARCHAR(255),
  telefono VARCHAR(64),
  tipo VARCHAR(64),
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS direccion (
  id CHAR(36) PRIMARY KEY,
  auth_user_id CHAR(36) NOT NULL,
  etiqueta VARCHAR(64),
  direccion_completa VARCHAR(512),
  ciudad VARCHAR(128),
  departamento VARCHAR(128),
  distrito VARCHAR(128),
  referencia VARCHAR(512),
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_dir_auth_user (auth_user_id)
);

CREATE INDEX idx_agricultor_email ON agricultor(email);
CREATE INDEX idx_comprador_email ON comprador(email);
