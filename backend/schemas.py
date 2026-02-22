from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List
from models import IncidentStatus, Severity, UserRole

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[UserRole] = None

class UserBase(BaseModel):
    username: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class IncidentBase(BaseModel):
    title: str
    description: str
    severity: Severity
    status: IncidentStatus

class IncidentCreate(IncidentBase):
    pass

class IncidentUpdate(BaseModel):
    status: Optional[IncidentStatus] = None
    severity: Optional[Severity] = None

class IncidentResponse(IncidentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    escalated_by: Optional[UserResponse] = None
    model_config = ConfigDict(from_attributes=True)

class DeploymentResponse(BaseModel):
    id: int
    service_name: str
    version: str
    status: str
    deployed_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MetricResponse(BaseModel):
    name: str
    value: float
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)
