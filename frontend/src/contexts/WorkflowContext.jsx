import React, { createContext, useState, useEffect } from "react";

export const WorkflowContext = createContext();

export const WorkflowProvider = ({ children }) => {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [workflowsFetchError, setWorkflowsFetchError] = useState(null);
  const [isWorkflowsFetching, setIsWorkflowsFetching] = useState(true);
  const [isWorkflowDetailLoading, setIsWorkflowDetailLoading] = useState(false);

  const fetchWorkflows = async () => {
    try {
      setIsWorkflowsFetching(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch("http://localhost:8000/api/workflows", {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`ワークフロー一覧の取得に失敗しました (${response.status})`);
      }

      const result = await response.json();
      setWorkflows(result);
      setWorkflowsFetchError(null);

    } catch (error) {
      console.error("ワークフロー一覧取得エラー:", error);
      setWorkflows([]);
      setWorkflowsFetchError(
        error.name === 'AbortError'
          ? "タイムアウトしました。再試行してください"
          : "ワークフロー一覧の取得に失敗しました。再試行してください"
      );
    } finally {
      setIsWorkflowsFetching(false);
    }
  };

  const fetchWorkflowById = async (workflowId) => {
    setIsWorkflowDetailLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`http://localhost:8000/api/workflows/${workflowId}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`ワークフローの取得に失敗しました (${response.status})`);
      }

      const workflow = await response.json();
      setSelectedWorkflow(workflow);
      return workflow;

    } catch (error) {
      console.error("ワークフロー取得エラー:", error);
      if (error.name === 'AbortError') {
        throw new Error("タイムアウトしました。再試行してください");
      }
      throw new Error("ワークフローの取得に失敗しました。再試行してください");
    } finally {
      setIsWorkflowDetailLoading(false);
    }
  };

  const createWorkflow = async (workflowData) => {
    try {
      const response = await fetch("http://localhost:8000/api/workflows", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(workflowData)
      });

      if (!response.ok) {
        throw new Error(`ワークフローの作成に失敗しました (${response.status})`);
      }

      const newWorkflow = await response.json();
      setWorkflows(prevWorkflows => [...prevWorkflows, newWorkflow]);
      return newWorkflow;

    } catch (error) {
      console.error("ワークフロー作成エラー:", error);
      throw new Error("ワークフローの作成に失敗しました。再試行してください");
    }
  };

  const updateWorkflow = async (workflowId, workflowData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/workflows/${workflowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(workflowData)
      });

      if (!response.ok) {
        throw new Error(`ワークフローの更新に失敗しました (${response.status})`);
      }

      const updatedWorkflow = await response.json();
      setWorkflows(prevWorkflows =>
        prevWorkflows.map(wf => wf.id === workflowId ? updatedWorkflow : wf)
      );
      return updatedWorkflow;

    } catch (error) {
      console.error("ワークフロー更新エラー:", error);
      throw new Error("ワークフローの更新に失敗しました。再試行してください");
    }
  };

  useEffect(() => {
    // TODO: バックエンド実装後に有効化
    // fetchWorkflows();
    
    // 一時的にモックデータを使用
    const mockWorkflows = [
      { id: 'wf001', name: 'ワークフローA', status: 'open', createdAt: '2024-07-01' },
      { id: 'wf002', name: 'ワークフローB', status: 'closed', createdAt: '2024-07-02' },
      { id: 'wf003', name: 'ワークフローC', status: 'open', createdAt: '2024-07-03' },
    ];
    setWorkflows(mockWorkflows);
    setIsWorkflowsFetching(false);
  }, []);

  const contextValue = {
    workflows,
    selectedWorkflow,
    setSelectedWorkflow,
    workflowsFetchError,
    isWorkflowsFetching,
    isWorkflowDetailLoading,
    fetchWorkflows,
    fetchWorkflowById,
    createWorkflow,
    updateWorkflow,
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
}; 