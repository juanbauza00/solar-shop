package com.solarshop.module.user.domain.service;

import com.solarshop.module.notification.domain.service.NotificationService;
import com.solarshop.module.user.api.dto.LoginRequest;
import com.solarshop.module.user.api.dto.RegisterRequest;
import com.solarshop.module.user.api.dto.TokenResponse;
import com.solarshop.module.user.api.dto.UserDto;
import com.solarshop.module.user.domain.model.User;
import com.solarshop.module.user.domain.repository.UserRepository;
import com.solarshop.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email ya registrado");
        }

        if (userRepository.existsByDocumentNumber(request.getDocumentNumber())) {
            throw new RuntimeException("Documento ya registrado");
        }

        // Aquí iría el mapeo de DTO a entidad y guardado en BD
        // También se enviaría el email de verificación

        String verificationToken = UUID.randomUUID().toString();
        // Guardar usuario con token de verificación...

        // Enviar email de verificación
        notificationService.sendEmail(
                request.getEmail(),
                "Verificación de cuenta",
                "Por favor, verifica tu cuenta haciendo clic en el siguiente enlace: " +
                        "http://localhost:4200/verify?token=" + verificationToken
        );
    }

    public TokenResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UserDto userDto = userService.mapToDto(user);

        return TokenResponse.builder()
                .token(jwt)
                .user(userDto)
                .build();
    }
}