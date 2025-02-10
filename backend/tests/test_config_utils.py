from unittest.mock import patch
from utils.config_utils import get_settings
import functools


@patch("utils.config_utils.config.Settings")
def test_get_settings_only_called_once_with_lru(mock_settings_call):
    get_settings.cache_clear()
    get_settings()
    get_settings()
    # Ensure the Settings constructor is called only once due to lru_cache
    mock_settings_call.assert_called_once()
    get_settings.cache_clear()


def test_import_settings_does_not_raise_error():
    import backend.utils.llm_utils  # noqa: F401
    import backend.utils.auth_utils  # noqa: F401
    import main  # noqa: F401
