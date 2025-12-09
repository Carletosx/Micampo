-- Perfil extendido del usuario (1:1 con usuarios de auth)
CREATE TABLE IF NOT EXISTS usuarios_perfil (
  id BIGINT NOT NULL AUTO_INCREMENT,
  auth_usuario_id BIGINT NOT NULL,
  nombres VARCHAR(120) NULL,
  apellidos VARCHAR(120) NULL,
  dni VARCHAR(20) NULL,
  telefono VARCHAR(30) NULL,
  email VARCHAR(180) NULL,
  direccion VARCHAR(255) NULL,
  ciudad VARCHAR(120) NULL,
  departamento VARCHAR(120) NULL,
  pais VARCHAR(120) NULL,
  fecha_nacimiento DATE NULL,
  genero VARCHAR(12) NULL,
  avatar_url VARCHAR(512) NULL,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_perfil_auth_usuario (auth_usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Fincas (1:N por usuario)
CREATE TABLE IF NOT EXISTS fincas (
  id BIGINT NOT NULL AUTO_INCREMENT,
  auth_usuario_id BIGINT NOT NULL,
  nombre VARCHAR(160) NULL,
  ubicacion VARCHAR(160) NULL,
  area_ha DECIMAL(8,2) NULL,
  certificacion VARCHAR(160) NULL,
  foto_url VARCHAR(512) NULL,
  video_url VARCHAR(512) NULL,
  descripcion TEXT NULL,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_fincas_usuario (auth_usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
