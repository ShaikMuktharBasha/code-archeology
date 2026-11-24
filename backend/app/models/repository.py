import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    source_type = Column(String(50), nullable=False) # 'zip' or 'github'
    source_url = Column(String(500), nullable=True)
    branch = Column(String(100), default="main")
    status = Column(String(50), default="ready") # 'pending', 'indexing', 'ready', 'failed'
    file_count = Column(Integer, default=0)
    symbol_count = Column(Integer, default=0)
    languages = Column(JSON, default=dict) # e.g. {"Python": 65, "TypeScript": 35}
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    files = relationship("RepositoryFile", back_populates="repository", cascade="all, delete-orphan")
    symbols = relationship("Symbol", back_populates="repository", cascade="all, delete-orphan")
    dependencies = relationship("DependencyEdge", back_populates="repository", cascade="all, delete-orphan")

class RepositoryFile(Base):
    __tablename__ = "repository_files"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    repository_id = Column(String(36), ForeignKey("repositories.id"), nullable=False, index=True)
    path = Column(String(1000), nullable=False)
    name = Column(String(255), nullable=False)
    extension = Column(String(20), nullable=True)
    language = Column(String(50), nullable=True)
    size_bytes = Column(Integer, default=0)
    line_count = Column(Integer, default=0)
    is_directory = Column(Boolean, default=False)
    parent_path = Column(String(1000), nullable=True)
    content = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    repository = relationship("Repository", back_populates="files")
    symbols = relationship("Symbol", back_populates="file", cascade="all, delete-orphan")

class Symbol(Base):
    __tablename__ = "symbols"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    repository_id = Column(String(36), ForeignKey("repositories.id"), nullable=False, index=True)
    file_id = Column(String(36), ForeignKey("repository_files.id"), nullable=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    symbol_type = Column(String(50), nullable=False) # 'module', 'class', 'function', 'interface', 'endpoint'
    language = Column(String(50), nullable=False)
    file_path = Column(String(1000), nullable=False)
    start_line = Column(Integer, nullable=False)
    end_line = Column(Integer, nullable=False)
    signature = Column(Text, nullable=True)
    docstring = Column(Text, nullable=True)
    metadata_json = Column(JSON, default=dict)

    repository = relationship("Repository", back_populates="symbols")
    file = relationship("RepositoryFile", back_populates="symbols")

class DependencyEdge(Base):
    __tablename__ = "dependency_edges"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    repository_id = Column(String(36), ForeignKey("repositories.id"), nullable=False, index=True)
    source_id = Column(String(255), nullable=False, index=True)
    target_id = Column(String(255), nullable=False, index=True)
    relation_type = Column(String(50), nullable=False) # 'imports', 'calls', 'extends', 'depends_on'
    source_file = Column(String(1000), nullable=True)
    target_file = Column(String(1000), nullable=True)
    weight = Column(Integer, default=1)
    metadata_json = Column(JSON, default=dict)

    repository = relationship("Repository", back_populates="dependencies")
