package com.it.molou3_backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dbqxhebv7"); // Remplace par ton cloud_name
        config.put("api_key", "646779247743842");       // Remplace par ton api_key
        config.put("api_secret", "HexAKIdY_AqyxwNuSh14U-pf9MM"); // Remplace par ton api_secret
        return new Cloudinary(config);
    }
}