import os
import zipfile
from pathlib import Path
from typing import Tuple

class SecurityGuard:
    """Safeguards repository ingestion against path traversal, zip slip, and malicious payloads."""

    @staticmethod
    def is_safe_path(base_dir: str, target_path: str) -> bool:
        """Verifies that the target path is strictly contained within base_dir (prevents Zip Slip)."""
        base = os.path.abspath(base_dir)
        target = os.path.abspath(target_path)
        return target.startswith(base)

    @classmethod
    def validate_zip(cls, zip_filepath: str, extract_to: str, max_size_bytes: int = 100 * 1024 * 1024) -> Tuple[bool, str]:
        """
        Validates a ZIP file before extraction:
        1. Checks for directory traversal members.
        2. Checks total uncompressed size against zip bomb attacks.
        """
        total_size = 0
        try:
            with zipfile.ZipFile(zip_filepath, 'r') as zf:
                for member in zf.infolist():
                    # Calculate target path
                    target_member_path = os.path.join(extract_to, member.filename)
                    if not cls.is_safe_path(extract_to, target_member_path):
                        return False, f"Malicious path traversal detected in ZIP: {member.filename}"
                    
                    total_size += member.file_size
                    if total_size > max_size_bytes:
                        return False, f"Uncompressed ZIP payload exceeds limit of {max_size_bytes / (1024*1024)} MB"
            return True, "ZIP file is safe"
        except zipfile.BadZipFile:
            return False, "Invalid or corrupted ZIP archive"
        except Exception as e:
            return False, f"Verification error: {str(e)}"
