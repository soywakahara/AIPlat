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
      const response = await fetch(`http://localhost:8000/api/workflow/${workflowId}`, {
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

      await fetchWorkflows();

      const newWorkflow = await response.json();
      return newWorkflow;

    } catch (error) {
      console.error("ワークフロー作成エラー:", error);
      throw new Error("ワークフローの作成に失敗しました。再試行してください");
    }
  };

  const upsertWorkflow = async (workflowData) => {
    console.log("upsertWorkflow", workflowData);
    try {
      const response = await fetch("http://localhost:8000/api/workflow", {
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

      await fetchWorkflows();

      const result = await response.json();
      const updatedWorkflow = result.workflow;

      if (selectedWorkflow?.workflowId === updatedWorkflow.workflowId) {
        setSelectedWorkflow(updatedWorkflow);
      }

      return updatedWorkflow;

    } catch (error) {
      console.error("ワークフロー更新エラー:", error);
      throw new Error("ワークフローの更新に失敗しました。再試行してください");
    }
  };

  useEffect(() => {
    fetchWorkflows();
    // 一時的にモックデータを使用
    /*
    const mockWorkflows = [
      {
        workflowId: 'wf001',
        workflowName: 'ワークフローA',
        workflowStatus: 'open',
        workflowCreatedAt: '2024-07-01',
        workflowTrigger: {
          triggerType: 'manual'
        },
        workflowActions: [
          {
            actionId: '1',
            actionName: 'ActionX',
            actionType: 'data_load',
            actionStatus: 'completed',
            actionCreatedAt: '2024-07-01',
            actionAPI: '',
            outputURL: '',
            actionConfig: {}
          }
        ]
      },
      {
        workflowId: 'wf002',
        workflowName: 'ワークフローB',
        workflowStatus: 'closed',
        workflowCreatedAt: '2024-07-02',
        workflowTrigger: {
          triggerType: 'schedule'
        },
        workflowActions: []
      },
      {
        workflowId: 'wf003',
        workflowName: 'ワークフローC',
        workflowStatus: 'open',
        workflowCreatedAt: '2024-07-03',
        workflowTrigger: {
          triggerType: 'manual'
        },
        workflowActions: []
      },
    ];
    setWorkflows(mockWorkflows);
    setIsWorkflowsFetching(false);
    */
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
    upsertWorkflow,
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
}; 