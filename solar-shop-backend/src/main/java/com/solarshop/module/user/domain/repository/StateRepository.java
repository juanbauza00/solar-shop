package com.solarshop.module.user.domain.repository;

import com.solarshop.module.user.domain.model.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StateRepository extends JpaRepository<State, Long> {
    List<State> findByCountryId(Long countryId);
    Optional<State> findByNameAndCountryId(String name, Long countryId);
}