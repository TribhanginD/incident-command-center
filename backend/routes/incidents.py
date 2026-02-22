from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.get("/", response_model=List[schemas.IncidentResponse])
def get_incidents(db: Session = Depends(get_db), current_user = Depends(auth.get_current_user)):
    return db.query(models.Incident).all()

@router.post("/", response_model=schemas.IncidentResponse)
def create_incident(incident: schemas.IncidentCreate, db: Session = Depends(get_db), current_user = Depends(auth.check_role(["admin", "engineer"]))):
    db_incident = models.Incident(**incident.model_dump())
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident

@router.patch("/{incident_id}", response_model=schemas.IncidentResponse)
def update_incident(incident_id: int, incident_update: schemas.IncidentUpdate, db: Session = Depends(get_db), current_user = Depends(auth.check_role(["admin", "engineer"]))):
    db_incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not db_incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    update_data = incident_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_incident, key, value)
    
    db.commit()
    db.refresh(db_incident)
    return db_incident

@router.post("/{incident_id}/escalate", response_model=schemas.IncidentResponse)
def escalate_incident(incident_id: int, db: Session = Depends(get_db), current_user = Depends(auth.check_role(["admin"]))):
    db_incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not db_incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    db_incident.severity = models.Severity.P0
    db_incident.escalated_by_id = current_user.id
    
    db.commit()
    db.refresh(db_incident)
    return db_incident
