"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Heart, Briefcase, Plus, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PersonalTask } from "@/types/routine";

interface Step5Props {
  tasks: PersonalTask[];
  onToggle: (taskId: string) => void;
  onAdd: (title: string, category: PersonalTask["category"]) => void;
  onComplete: () => void;
}

const CATEGORY_INFO = {
  exercise: { icon: Dumbbell, color: "text-green-500", bg: "bg-green-100" },
  health: { icon: Heart, color: "text-rose-500", bg: "bg-rose-100" },
  personal: { icon: Briefcase, color: "text-blue-500", bg: "bg-blue-100" },
};

export function Step5Tasks({ tasks, onToggle, onAdd, onComplete }: Step5Props) {
  const t = useTranslations("steps.step5");
  const tc = useTranslations("common");
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState<PersonalTask["category"]>("personal");

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAdd(newTask.trim(), newCategory);
      setNewTask("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-[70vh] p-6"
    >
      <div className="text-center mb-6">
        <motion.div
          className="text-6xl mb-4"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          🏃
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("title")}</h2>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>

      {/* Progress Bar */}
      <div className="glass rounded-2xl p-4 max-w-md w-full mx-auto mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">{t("progress", { completed: completedCount, total: tasks.length })}</span>
          {completedCount === tasks.length && tasks.length > 0 && (
            <span className="font-semibold text-green-600">{t("allComplete")}</span>
          )}
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="glass rounded-2xl p-4 max-w-md w-full mx-auto mb-4">
        <div className="space-y-2 mb-4">
          <AnimatePresence>
            {tasks.map((task) => {
              const categoryInfo = CATEGORY_INFO[task.category];
              const Icon = categoryInfo.icon;

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    task.completed ? "bg-green-50" : "bg-white/50"
                  }`}
                >
                  <button
                    onClick={() => onToggle(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4 text-white" />}
                  </button>

                  <div className={`p-1.5 rounded-lg ${categoryInfo.bg}`}>
                    <Icon className={`w-4 h-4 ${categoryInfo.color}`} />
                  </div>

                  <span className={`flex-1 text-sm ${task.completed ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    {task.title}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Add New Task */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex gap-2 mb-2">
            {(Object.keys(CATEGORY_INFO) as Array<keyof typeof CATEGORY_INFO>).map((cat) => {
              const info = CATEGORY_INFO[cat];
              const Icon = info.icon;
              return (
                <button
                  key={cat}
                  onClick={() => setNewCategory(cat)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
                    newCategory === cat ? info.bg + " " + info.color : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {t(`categories.${cat}`)}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              placeholder={t("addTaskPlaceholder")}
              className="flex-1 p-3 rounded-xl bg-white/50 border-none focus:ring-2 focus:ring-green-300 text-sm"
            />
            <button
              onClick={handleAddTask}
              disabled={!newTask.trim()}
              className="px-4 py-2 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <div className="max-w-md w-full mx-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="w-full py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-green-400 to-emerald-500 text-white"
        >
          {tc("next")} →
        </motion.button>
        <button
          onClick={onComplete}
          className="w-full mt-3 text-gray-400 text-sm underline"
        >
          {tc("skip")}
        </button>
      </div>
    </motion.div>
  );
}
