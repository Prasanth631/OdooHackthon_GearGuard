package com.gearguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GearGuardApplication {

    public static void main(String[] args) {
        SpringApplication.run(GearGuardApplication.class, args);
        System.out.println("\n" +
                "╔═══════════════════════════════════════════════════════════╗\n" +
                "║   GearGuard Maintenance Tracker - Backend Started!        ║\n" +
                "║   Server running on: http://localhost:8088                ║\n" +
                "║   API Base URL: http://localhost:8088/api                 ║\n" +
                "╚═══════════════════════════════════════════════════════════╝\n");
    }
}
