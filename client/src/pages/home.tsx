import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type Task, type InsertTask } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, ListChecks, Fan, CheckCheck, Trash2 } from "lucide-react";

export default function Home() {
  const [newTaskText, setNewTaskText] = useState("");
  const { toast } = useToast();

  // Fetch all tasks
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: InsertTask) => {
      const response = await apiRequest("POST", "/api/tasks", taskData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setNewTaskText("");
      toast({ title: "Task added successfully!" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to add task",
        variant: "destructive" 
      });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const response = await apiRequest("PATCH", `/api/tasks/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to update task",
        variant: "destructive" 
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task deleted successfully!" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to delete task",
        variant: "destructive" 
      });
    },
  });

  // Clear completed tasks mutation
  const clearCompletedMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/tasks/completed/clear");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Completed tasks cleared!" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to clear completed tasks",
        variant: "destructive" 
      });
    },
  });

  // Mark all complete mutation
  const markAllCompleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", "/api/tasks/complete/all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "All tasks marked as complete!" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to mark all tasks as complete",
        variant: "destructive" 
      });
    },
  });

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      createTaskMutation.mutate({ 
        text: newTaskText.trim(),
        completed: false 
      });
    }
  };

  const handleToggleTask = (id: string, completed: boolean) => {
    updateTaskMutation.mutate({ id, updates: { completed } });
  };

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-black mb-2">Tasks</h1>
        <p className="text-[#8E8E93] text-base">Simple task management for daily productivity</p>
      </div>

      {/* Add Task Section */}
      <Card className="mb-6 border-0 shadow-sm bg-white rounded-2xl">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-[#007AFF] focus:ring-[#007AFF] focus:ring-opacity-20 text-black placeholder-[#8E8E93] task-input"
              disabled={createTaskMutation.isPending}
            />
            <Button
              onClick={handleAddTask}
              disabled={createTaskMutation.isPending || !newTaskText.trim()}
              className="bg-[#007AFF] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 add-button"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="border-0 shadow-sm bg-white rounded-2xl">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#007AFF] mb-1">{totalTasks}</div>
            <div className="text-sm text-[#8E8E93]">Total Tasks</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white rounded-2xl">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#34C759] mb-1">{completedTasks}</div>
            <div className="text-sm text-[#8E8E93]">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-black flex items-center">
            <ListChecks className="text-[#007AFF] mr-2 h-5 w-5" />
            Your Tasks
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {tasks.length === 0 ? (
            <div className="p-8 text-center">
              <ListChecks className="mx-auto h-12 w-12 text-[#8E8E93] mb-4" />
              <p className="text-[#8E8E93] text-lg mb-2">No tasks yet</p>
              <p className="text-[#8E8E93] text-sm">Add your first task to get started!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="task-item flex items-center p-4 group hover:bg-[#007AFF]/5 transition-all duration-200">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => handleToggleTask(task.id, !!checked)}
                  className="task-checkbox mr-4 flex-shrink-0 h-[22px] w-[22px] rounded-full border-2 border-[#007AFF] data-[state=checked]:bg-[#34C759] data-[state=checked]:border-[#34C759]"
                  disabled={updateTaskMutation.isPending}
                />
                <span className={`flex-1 ${task.completed ? 'task-completed line-through text-[#8E8E93]' : 'text-black'} transition-all duration-300`}>
                  {task.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                  disabled={deleteTaskMutation.isPending}
                  className="text-[#8E8E93] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 p-1 h-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="mt-6 flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => clearCompletedMutation.mutate()}
          disabled={clearCompletedMutation.isPending || completedTasks === 0}
          className="bg-white text-[#8E8E93] px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors duration-200 shadow-sm border-gray-200"
        >
          <Fan className="mr-2 h-4 w-4" />
          Clear Completed
        </Button>
        <Button
          variant="outline"
          onClick={() => markAllCompleteMutation.mutate()}
          disabled={markAllCompleteMutation.isPending || totalTasks === 0 || completedTasks === totalTasks}
          className="bg-white text-[#8E8E93] px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors duration-200 shadow-sm border-gray-200"
        >
          <CheckCheck className="mr-2 h-4 w-4" />
          Complete All
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-[#8E8E93] text-sm">
        <p>Stay organized, stay productive</p>
      </div>
    </div>
  );
}
