package com.agromarket.inventory.config;

import com.agromarket.inventory.dto.ErrorRespuesta;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.stream.Collectors;

@ControllerAdvice
public class ManejadorErrores {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorRespuesta> handleValidation(MethodArgumentNotValidException ex) {
    String detalles = ex.getBindingResult().getFieldErrors().stream().map(FieldError::getDefaultMessage).collect(Collectors.joining(", "));
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorRespuesta("VALIDACION", "Datos inválidos", detalles));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorRespuesta> handleIllegal(IllegalArgumentException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorRespuesta("ARGUMENTO", ex.getMessage(), null));
  }

  @ExceptionHandler(java.util.NoSuchElementException.class)
  public ResponseEntity<ErrorRespuesta> handleNotFound(java.util.NoSuchElementException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorRespuesta("NO_ENCONTRADO", "Recurso no encontrado", null));
  }
}

