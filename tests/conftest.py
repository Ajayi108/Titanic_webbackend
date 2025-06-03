# WEB-BACKEND/tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock # unittest.mock.patch is used by session_mocker

# Globally accessible Mocks for Database Operations
MOCKED_PG_CONNECTION = MagicMock(name="GlobalMockedPGConnection")
MOCKED_PG_CURSOR = MagicMock(name="GlobalMockedPGCursor")

# Global Mocking Setup for the Entire Test Session 
@pytest.fixture(scope="session", autouse=True)
def truly_global_db_mock(session_mocker): # session_mocker from pytest-mock
    """Patches psycopg2.connect globally and mocks DML functions in 'database.py'."""

    def mock_psycopg2_connect_replacement(*args, **kwargs):
        # This function replaces the real psycopg2.connect.
        MOCKED_PG_CONNECTION.reset_mock()
        MOCKED_PG_CURSOR.reset_mock() # Reset the main mock object

        # Re-assign fresh MagicMock objects for methods to ensure clean state for call counts
        MOCKED_PG_CONNECTION.cursor = MagicMock(return_value=MOCKED_PG_CURSOR, name="conn_cursor_method_mock")
        MOCKED_PG_CONNECTION.commit = MagicMock(name="conn_commit_method_mock")
        MOCKED_PG_CONNECTION.rollback = MagicMock(name="conn_rollback_method_mock")

        MOCKED_PG_CURSOR.execute = MagicMock(name="cursor_execute_method_mock")
        MOCKED_PG_CURSOR.fetchone = MagicMock(name="cursor_fetchone_method_mock", return_value=None)
        MOCKED_PG_CURSOR.fetchall = MagicMock(name="cursor_fetchall_method_mock", return_value=[])
        MOCKED_PG_CURSOR.connection = MOCKED_PG_CONNECTION
        return MOCKED_PG_CONNECTION

    session_mocker.patch("psycopg2.connect", side_effect=mock_psycopg2_connect_replacement)

    functions_to_mock_in_database_py = [
        'create_tables', 'add_name', 'remove_name',
        'add_user', 'add_prediction'
    ]
    for func_name in functions_to_mock_in_database_py:
        session_mocker.patch(f'database.{func_name}', MagicMock(name=f"mocked_{func_name}_in_database_py"))
 

#  Fixture to Reset Global Mocks Before Each Unit Test Not Using 'client' 
@pytest.fixture(autouse=True)
def reset_shared_db_mocks_for_unit_tests(truly_global_db_mock, mocked_pg_cursor, mocked_pg_conn):
    """Ensures a clean state for shared global mocks before each test function."""
   
    mocked_pg_cursor.reset_mock() 
    mocked_pg_cursor.execute = MagicMock(name="cursor_execute_method_mock_reset")
    mocked_pg_cursor.fetchone = MagicMock(name="cursor_fetchone_method_mock_reset", return_value=None)
    mocked_pg_cursor.fetchall = MagicMock(name="cursor_fetchall_method_mock_reset", return_value=[])

    mocked_pg_conn.reset_mock() 
    mocked_pg_conn.cursor = MagicMock(return_value=mocked_pg_cursor, name="conn_cursor_method_mock_reset")
    mocked_pg_conn.commit = MagicMock(name="conn_commit_method_mock_reset")
    mocked_pg_conn.rollback = MagicMock(name="conn_rollback_method_mock_reset")
    mocked_pg_cursor.connection = mocked_pg_conn 
    yield

# Fixture for FastAPI TestClient
@pytest.fixture(scope="function")
def client(truly_global_db_mock, reset_shared_db_mocks_for_unit_tests) -> TestClient:
    """Provides a FastAPI TestClient; global mocks ensure no real DB access."""

    from main import app
    with TestClient(app) as c:
        yield c

# Fixtures to Provide Access to Global Mocks for Test Configuration
@pytest.fixture
def mocked_pg_cursor():
    """Provides the globally mocked database cursor."""
    return MOCKED_PG_CURSOR

@pytest.fixture
def mocked_pg_conn():
    """Provides the globally mocked database connection."""
    return MOCKED_PG_CONNECTION