from unittest.mock import patch
from utils.config_utils import get_settings


@patch("utils.config_utils.config.Settings")
def test_import_settings(mock_settings_call):
    import backend.utils.llm_utils  # noqa: F401

    assert mock_settings_call.called
    import backend.utils.auth_utils  # noqa: F401

    assert mock_settings_call.called
    import main  # noqa: F401

    assert mock_settings_call.called


@patch("utils.config_utils.config.Settings")
def test_get_settings_only_called_once_with_lru(mock_settings_call):
    get_settings()
    get_settings()
    # Ensure the Settings constructor is called only once due to lru_cache
    mock_settings_call.assert_called_once()
