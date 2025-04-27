package com.solarshop.module.user.domain.service;

import com.solarshop.module.user.api.dto.UserDto;
import com.solarshop.module.user.domain.model.User;
import com.solarshop.module.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(new SimpleGrantedAuthority(user.getRole().getName()))  // Corregido aquí
                .accountExpired(false)
                .accountLocked(user.getAccountLockedUntil() != null)
                .credentialsExpired(false)
                .disabled(!user.getStatus().getName().equals("ACTIVE"))
                .build();
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));
        return mapToDto(user);
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
        return mapToDto(user);
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public UserDto mapToDto(User user) {
        if (user == null) return null;

        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .documentType(user.getDocumentType().getName())
                .documentNumber(user.getDocumentNumber())
                .birthDate(user.getBirthDate())
                .country(user.getCountry().getName())
                .state(user.getState() != null ? user.getState().getName() : null)
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().getName())
                .build();
    }
}