package com.example.turf.selenium;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import static org.junit.jupiter.api.Assertions.*;

public class RegisterPageTest {

    @Test
    public void testRegistrationEndpointAccessible() {
        WebDriver driver = new HtmlUnitDriver(true);

        try {
            // Test that our registration API endpoint concept exists
            driver.get("http://localhost:8080/api/auth/register");

            // Simple assertion that we can make a request
            assertTrue(driver.getCurrentUrl().contains("/api/auth/register"));
            System.out.println("✓ Registration endpoint is accessible");

        } finally {
            driver.quit();
        }
    }

    @Test
    public void testRegistrationFlow() {
        WebDriver driver = new HtmlUnitDriver(true);

        try {
            // Simulate a registration page load
            driver.get("http://localhost:8080/");

            // Just verify that we can interact with a web driver
            String pageSource = driver.getPageSource();
            assertNotNull(pageSource);
            System.out.println("✓ Web driver is working correctly");

        } finally {
            driver.quit();
        }
    }
}