import sys  # For PyInstaller
import os


def get_file_path(filename):
    # For PyInstaller: Get the path to bundled files
    if hasattr(sys, "_MEIPASS"):
        return os.path.join(sys._MEIPASS, filename)
    else:
        return filename  # Fallback for development
