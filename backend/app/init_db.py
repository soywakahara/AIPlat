# backend/app/init_db.py
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import json
import os

async def init_db():
    try:
        current_dir = os.getcwd()
        print(f"現在のディレクトリ: {current_dir}")
        
        # ディレクトリの内容を表示
        files = os.listdir(current_dir)
        print("ファイル一覧:")
        for file in files:
            print(f"- {file}")
        
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        client = AsyncIOMotorClient(mongodb_url, serverSelectionTimeoutMS=6000)
        
        await client.admin.command('ping')
        print("mongoDBへの接続成功")
        #db名は一旦test_dbとする
        db = client.workflow_db
        
        await db.workflows.drop()
        print("コレクション内のドキュメントを全て削除")
        
        file_path = '/Users/soichi111/Projects/AIPlat/backend/app/test_data/workflowData.json'
        try:
            with open(file_path, 'r') as file:
                data = json.load(file)
                print(f"成功 {file_path}")
        except FileNotFoundError:
            print(f" not found  {file_path}")
            return
        
        result = await db.workflows.insert_many(data)
        print(f"インサート成功 {len(result.inserted_ids)}")
        
    except Exception as e:
        print(f"エラー: {e}")
    finally:
        if 'client' in locals():
            client.close()
            print("クローズ")

if __name__ == "__main__":
    asyncio.run(init_db())