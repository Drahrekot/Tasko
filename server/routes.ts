import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Create a new task
  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid task data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create task" });
      }
    }
  });

  // Update a task
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedTask = await storage.updateTask(id, updates);
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // Delete a task
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTask(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Clear completed tasks
  app.delete("/api/tasks/completed/clear", async (req, res) => {
    try {
      await storage.clearCompletedTasks();
      res.json({ message: "Completed tasks cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear completed tasks" });
    }
  });

  // Mark all tasks as complete
  app.patch("/api/tasks/complete/all", async (req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      const updatePromises = tasks
        .filter(task => !task.completed)
        .map(task => storage.updateTask(task.id, { completed: true }));
      
      await Promise.all(updatePromises);
      const updatedTasks = await storage.getAllTasks();
      res.json(updatedTasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark all tasks as complete" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
