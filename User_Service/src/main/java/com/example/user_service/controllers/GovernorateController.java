package com.example.user_service.controllers;


import com.example.user_service.services.GovernorateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class GovernorateController {

    @Autowired
    private GovernorateService governorateService;

    @GetMapping("/governorates")
    public List<String> getGovernorates() {
        return governorateService.getGovernorates();
    }
}