import sys
import os

pytest_plugins = "tests.fixtures"

# Add the parent directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
