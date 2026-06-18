package com.arl.arlbackend.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Lightweight endpoint used by the Angular login page to verify Basic Auth
 * credentials. It is protected by Spring Security, so a successful (200)
 * response means the username/password are valid.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/me")
    public Map<String, Object> me(Principal principal) {
        Map<String, Object> response = new HashMap<>();
        response.put("username", principal.getName());
        response.put("authenticated", true);
        return response;
    }
}
