import os
from unittest.mock import MagicMock

# ----------------------------------
# Neutralized Database Layer
# No database dependency for easy testing
# ----------------------------------

engine = MagicMock()
SessionLocal = MagicMock()
Base = MagicMock()