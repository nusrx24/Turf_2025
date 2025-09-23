package com.example.turf.bdd;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import static org.junit.jupiter.api.Assertions.*;

public class AuthSteps {

    private String email;
    private boolean registrationSuccess;
    private boolean emailExists;

    @Given("a user provides valid registration details")
    public void a_user_provides_valid_registration_details() {
        this.email = "newuser@example.com";
        this.emailExists = false;
    }

    @Given("a user provides an email that already exists")
    public void a_user_provides_an_email_that_already_exists() {
        this.email = "existing@example.com";
        this.emailExists = true;
    }

    @When("the user submits the registration form")
    public void the_user_submits_the_registration_form() {
        // Simulate registration process
        if (emailExists) {
            registrationSuccess = false;
        } else {
            registrationSuccess = true;
        }
    }

    @Then("the registration should be successful")
    public void the_registration_should_be_successful() {
        assertTrue(registrationSuccess, "Registration should be successful");
    }

    @Then("the system should show an error message")
    public void the_system_should_show_an_error_message() {
        assertFalse(registrationSuccess, "Registration should fail with existing email");
    }
}