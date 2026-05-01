from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from database import Base
import datetime

class Campaign(Base):
    __tablename__ = "campaigns"
    id = Column(Integer, primary_key=True, index=True)
    product = Column(String, index=True)
    audience = Column(String)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Pitch(Base):
    __tablename__ = "pitches"
    id = Column(Integer, primary_key=True, index=True)
    product = Column(String, index=True)
    problem = Column(Text)
    solution = Column(Text)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Lead(Base):
    __tablename__ = "leads"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    company = Column(String)
    score = Column(Integer)
    priority = Column(String)
    recommendation = Column(Text)
    reasoning = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    category = Column(String)
    priority = Column(String) # high, medium, low
    status = Column(String, default="Backlog") # Backlog, In Progress, Completed
    due_date = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
