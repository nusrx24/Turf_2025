Feature: User Registration
  As a new user
  I want to register an account
  So that I can book turfs

  Scenario: Successful user registration
    Given a user provides valid registration details
    When the user submits the registration form
    Then the registration should be successful

  Scenario: Registration with existing email
    Given a user provides an email that already exists
    When the user submits the registration form
    Then the system should show an error message