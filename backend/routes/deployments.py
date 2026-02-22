from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db

router = APIRouter(prefix="/deployments", tags=["deployments"])

@router.get("/", response_model=List[schemas.DeploymentResponse])
def get_deployments(db: Session = Depends(get_db), current_user = Depends(auth.get_current_user)):
    return db.query(models.Deployment).order_by(models.Deployment.deployed_at.desc()).all()

@router.post("/", response_model=schemas.DeploymentResponse)
def create_deployment(deployment: schemas.DeploymentResponse, db: Session = Depends(get_db), current_user = Depends(auth.check_role(["admin", "engineer"]))):
    # Logic to record a new deployment
    db_deployment = models.Deployment(**deployment.model_dump(exclude={"id"}))
    db.add(db_deployment)
    db.commit()
    db.refresh(db_deployment)
    return db_deployment
