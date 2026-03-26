import pytest
from fastapi.testclient import TestClient
from fastapi_backend.main import app
from fastapi_backend.database.connection import Base, engine, SessionLocal
import os

client = TestClient(app)

def test_register_user():
    # Attempt to register a new user
    response = client.post(
        "/auth/register",
        json={"email": "testuser@example.com", "password": "strongpassword123"}
    )
    # Check if user already exists from previous runs or is new
    if response.status_code == 400:
        assert response.json()["detail"] == "Email already registered"
    else:
        assert response.status_code == 201
        assert response.json()["email"] == "testuser@example.com"

def test_login_user():
    # First ensure user exists (from previous test or re-registration attempt)
    client.post(
        "/auth/register",
        json={"email": "testuser@example.com", "password": "strongpassword123"}
    )
    
    response = client.post(
        "/auth/login",
        json={"email": "testuser@example.com", "password": "strongpassword123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_invalid_credentials():
    response = client.post(
        "/auth/login",
        json={"email": "testuser@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"