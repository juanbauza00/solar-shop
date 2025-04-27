package com.solarshop.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserSecurity {

    public boolean isCurrentUser(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        // El nombre de usuario es el email
        String email = authentication.getName();

        // Aquí normalmente buscaríamos el usuario por email para obtener su ID
        // Por simplicidad, asumimos que el ID está en los detalles del usuario
        Object principal = authentication.getPrincipal();
        if (principal instanceof org.springframework.security.core.userdetails.User) {
            // Aquí se podría extraer el ID si estuviera disponible
            // Para este ejemplo, devolvemos false ya que no tenemos acceso directo al ID
            return false;
        }

        return false;
    }
}