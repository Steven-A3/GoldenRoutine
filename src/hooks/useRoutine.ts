"use client";

import { useState, useEffect, useCallback } from "react";
import type { RoutineProgress, DailyIntention, JournalEntry, PersonalTask } from "@/types/routine";

const STORAGE_KEYS = {
  PROGRESS: "morning_golden_time_progress",
  INTENTION: "morning_golden_time_intention",
  JOURNAL: "morning_golden_time_journal",
  TASKS: "morning_golden_time_tasks",
};

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      if (parsed.date === getTodayKey()) {
        return parsed.data;
      }
    }
  } catch (e) {
    console.error("Storage read error:", e);
  }
  return defaultValue;
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify({ date: getTodayKey(), data: value }));
  } catch (e) {
    console.error("Storage write error:", e);
  }
}

interface UseRoutineOptions {
  defaultTasks: PersonalTask[];
}

export function useRoutine({ defaultTasks }: UseRoutineOptions) {
  const [progress, setProgress] = useState<RoutineProgress>({
    currentStep: 1,
    completedSteps: [],
    startedAt: null,
    completedAt: null,
  });

  const [intention, setIntention] = useState<DailyIntention>({
    feeling: "",
    goal: "",
    affirmation: "",
  });

  const [journal, setJournal] = useState<JournalEntry>({
    date: getTodayKey(),
    content: "",
    gratitude: [],
  });

  const [tasks, setTasks] = useState<PersonalTask[]>(defaultTasks);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgress(getStorageItem(STORAGE_KEYS.PROGRESS, progress));
    setIntention(getStorageItem(STORAGE_KEYS.INTENTION, intention));
    setJournal(getStorageItem(STORAGE_KEYS.JOURNAL, journal));
    setTasks(getStorageItem(STORAGE_KEYS.TASKS, tasks));
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setStorageItem(STORAGE_KEYS.PROGRESS, progress);
    }
  }, [progress, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setStorageItem(STORAGE_KEYS.INTENTION, intention);
    }
  }, [intention, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setStorageItem(STORAGE_KEYS.JOURNAL, journal);
    }
  }, [journal, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setStorageItem(STORAGE_KEYS.TASKS, tasks);
    }
  }, [tasks, isLoaded]);

  const startRoutine = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      startedAt: new Date().toISOString(),
      currentStep: 1,
    }));
  }, []);

  const completeStep = useCallback((stepId: number) => {
    setProgress((prev) => {
      const newCompletedSteps = prev.completedSteps.includes(stepId)
        ? prev.completedSteps
        : [...prev.completedSteps, stepId];

      const isAllComplete = newCompletedSteps.length === 6;

      return {
        ...prev,
        completedSteps: newCompletedSteps,
        currentStep: isAllComplete ? 6 : Math.min(stepId + 1, 6),
        completedAt: isAllComplete ? new Date().toISOString() : null,
      };
    });
  }, []);

  const goToStep = useCallback((stepId: number) => {
    setProgress((prev) => ({
      ...prev,
      currentStep: stepId,
    }));
  }, []);

  const updateIntention = useCallback((updates: Partial<DailyIntention>) => {
    setIntention((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateJournal = useCallback((updates: Partial<JournalEntry>) => {
    setJournal((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const addTask = useCallback((title: string, category: PersonalTask["category"] = "personal") => {
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title, completed: false, category },
    ]);
  }, []);

  const resetRoutine = useCallback(() => {
    setProgress({
      currentStep: 1,
      completedSteps: [],
      startedAt: null,
      completedAt: null,
    });
    setIntention({ feeling: "", goal: "", affirmation: "" });
    setJournal({ date: getTodayKey(), content: "", gratitude: [] });
    setTasks(defaultTasks);
  }, [defaultTasks]);

  return {
    progress,
    intention,
    journal,
    tasks,
    isLoaded,
    startRoutine,
    completeStep,
    goToStep,
    updateIntention,
    updateJournal,
    toggleTask,
    addTask,
    resetRoutine,
  };
}
