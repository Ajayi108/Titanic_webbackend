import pytest
from unittest.mock import patch
import bcrypt # For direct bcrypt usage in tests

# --- Unit Tests for Password Utility Functions ---
def test_password_hashing_and_verification_logic():
    from routes.auth import hash_password, verify_password # Import for this test block

    password = "testpassword123"
    hashed_once = hash_password(password)

    assert isinstance(hashed_once, str)
    assert password != hashed_once
    assert bcrypt.checkpw(password.encode(), hashed_once.encode()) # Direct check
    assert verify_password(password, hashed_once) is True          # Using app's function
    assert verify_password("wrong_password", hashed_once) is False

    # Test that different salts produce different hashes
    hashed_again = hash_password(password)
    assert hashed_once != hashed_again

    # Test that verify_password handles invalid hash formats by raising ValueError
    with pytest.raises(ValueError, match="Invalid salt"):
        verify_password(password, "not_a_valid_bcrypt_hash_format")
    with pytest.raises(ValueError): # Generic check for other malformed hashes
        verify_password(password, "$2a$04$short")

# --- Unit Tests for User Registration Route Logic ---
@pytest.mark.asyncio
async def test_register_user_success(mocked_pg_cursor, mocked_pg_conn):
    from routes.auth import register_user # Import specific route handler

    mocked_pg_cursor.fetchone.return_value = None # Email not already registered

    with patch('routes.auth.hash_password', return_value="mocked_hashed_password") as mock_hash_func:
        response = await register_user(
            email="new@example.com", password="pw123", first_name="New", last_name="User", is_admin=False
        )

    mocked_pg_cursor.execute.assert_any_call("SELECT id FROM users WHERE email = %s;", ("new@example.com",))
    mock_hash_func.assert_called_once_with("pw123")
    mocked_pg_cursor.execute.assert_any_call(
        "\n        INSERT INTO users (email, password, first_name, last_name, is_admin)\n        VALUES (%s, %s, %s, %s, %s);\n    ",
        ("new@example.com", "mocked_hashed_password", "New", "User", False)
    )
    mocked_pg_conn.commit.assert_called_once()
    assert response == {"message": "✅ User registered successfully"}

@pytest.mark.asyncio
async def test_register_user_email_exists(mocked_pg_cursor, mocked_pg_conn):
    from routes.auth import register_user, HTTPException

    mocked_pg_cursor.fetchone.return_value = (1,) # Email already registered

    with pytest.raises(HTTPException) as exc_info:
        await register_user(email="existing@example.com", password="pw", first_name="FName", last_name="LName")

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Email already registered"
    mocked_pg_conn.commit.assert_not_called()

# --- Unit Tests for User Login Route Logic ---
@pytest.mark.asyncio
async def test_login_user_success(mocked_pg_cursor, mocked_pg_conn):
    from routes.auth import login_user

    mocked_pg_cursor.fetchone.return_value = (1, "db_hashed_password", False, "Test", "User")

    with patch('routes.auth.verify_password', return_value=True) as mock_verify_func:
        response = await login_user(email="test@example.com", password="password123")

    mocked_pg_cursor.execute.assert_called_once_with(
        "SELECT id, password, is_admin, first_name, last_name FROM users WHERE email = %s;", ("test@example.com",)
    )
    mock_verify_func.assert_called_once_with("password123", "db_hashed_password")
    assert response == {
        "message": "✅ Login successful", "user_id": 1, "email": "test@example.com",
        "first_name": "Test", "last_name": "User", "is_admin": False
    }

@pytest.mark.asyncio
async def test_login_user_not_found(mocked_pg_cursor, mocked_pg_conn):
    from routes.auth import login_user, HTTPException
    mocked_pg_cursor.fetchone.return_value = None # User not found

    with pytest.raises(HTTPException) as exc_info:
        await login_user(email="noone@example.com", password="pw")

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Invalid email or password"

@pytest.mark.asyncio
async def test_login_user_incorrect_password(mocked_pg_cursor, mocked_pg_conn):
    from routes.auth import login_user, HTTPException
    mocked_pg_cursor.fetchone.return_value = (1, "db_hashed_password", False, "Test", "User") # User found

    with patch('routes.auth.verify_password', return_value=False) as mock_verify_func: # Password incorrect
        with pytest.raises(HTTPException) as exc_info:
            await login_user(email="test@example.com", password="wrongpassword")

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Invalid email or password"
    mock_verify_func.assert_called_once_with("wrongpassword", "db_hashed_password")