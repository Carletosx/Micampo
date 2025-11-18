package com.agromarket.autenticacion.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class ConfiguracionSeguridad {
  @Bean
  public SecurityFilterChain filtro(HttpSecurity http) throws Exception {
    http.csrf(c -> c.disable()).sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).authorizeHttpRequests(a -> a.requestMatchers("/autenticacion/**").permitAll().anyRequest().authenticated());
    return http.build();
  }

  @Bean
  public PasswordEncoder encriptador() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationManager manejadorAutenticacion(AuthenticationConfiguration c) throws Exception {
    return c.getAuthenticationManager();
  }
}
