from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect(self):
        mongodb_url = settings.MONGODB_URL
        self.client = AsyncIOMotorClient(mongodb_url)
        self.db = self.client.workflow_db
        
    async def close(self):
        if self.client:
            self.client.close()
            
    async def get_workflows(self):
        collection = self.db.workflows
        cursor = collection.find(
            {}, 
            {"workflowName": 1, "workflowId": 1, "workflowStatus": 1, "workflowCreatedAt": 1, "_id": 0}
        ).sort("workflowName", 1)
        workflows = await cursor.to_list(length=None)
        return workflows
    
    async def get_workflow_by_id(self, workflow_id: str):
        collection = self.db.workflows
        return await collection.find_one(
            {"workflowId": workflow_id},
            {"_id": 0}
        )

    async def upsert_workflow(self, workflow_data: dict):
        collection = self.db.workflows
        await collection.update_one(
            {"workflowId": workflow_data["workflowId"]},
            {"$set": workflow_data},
            upsert=True
        )
        return workflow_data

db = MongoDB() 