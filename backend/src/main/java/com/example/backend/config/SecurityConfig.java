package com.example.backend.config;

import com.example.backend.jwt.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;


import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:5173")); // your React origin
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowCredentials(true);
                    config.setAllowedHeaders(List.of("*"));
                    return config;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login", "/api/auth/signup").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/user").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/user").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/user/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/course").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/subject").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/joinedProduct").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/variant").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/review").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/faculty").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/FAQs").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/review/**").permitAll()
                        // .requestMatchers(HttpMethod.GET, "/api/orders/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/queries").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/responses").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/wishlist").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);



        return http.build();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
