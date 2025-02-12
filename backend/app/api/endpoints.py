from fastapi import APIRouter, HTTPException
from app.db.database import db
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

router = APIRouter()

class Action(BaseModel):
    actionId: str
    actionName: str
    actionType: str
    actionCategory: str
    actionStatus: Optional[str] = ""
    actionCreatedAt: str
    actionAPI: Optional[str] = ""
    outputURL: Optional[str] = ""
    actionConfig: Dict[str, Any] = {}

class Workflow(BaseModel):
    workflowId: str
    workflowName: str
    workflowStatus: Optional[str] = "draft"
    workflowCreatedAt: Optional[str]
    workflowTrigger: Optional[Dict[str, Any]] = None
    workflowActions: List[Action] = []

@router.get("/workflows")
async def get_workflow_list():
    try:
        workflows = await db.get_workflows()
        return workflows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/workflow/{workflow_id}")
async def get_workflow_by_id(workflow_id: str):
    try:
        workflow = await db.get_workflow_by_id(workflow_id)
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflowが見つかりませんでした")
        return workflow
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/workflow")
async def upsert_workflow(workflow: Workflow):
    try:
        workflow_data = workflow.dict()
        updated_workflow = await db.upsert_workflow(workflow_data)
        return {"message": "Workflow upserted successfully", "workflow": updated_workflow}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))