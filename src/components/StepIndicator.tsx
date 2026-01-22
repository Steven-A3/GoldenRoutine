"use client";

import { motion } from "framer-motion";
import { ROUTINE_STEPS } from "@/types/routine";

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export function StepIndicator({ currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {ROUTINE_STEPS.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        const isAccessible = isCompleted || step.id <= Math.max(...completedSteps, 0) + 1;

        return (
          <motion.button
            key={step.id}
            whileHover={isAccessible ? { scale: 1.1 } : {}}
            whileTap={isAccessible ? { scale: 0.95 } : {}}
            onClick={() => isAccessible && onStepClick(step.id)}
            disabled={!isAccessible}
            className={`
              relative flex items-center justify-center transition-all duration-300
              ${isCurrent ? "w-10 h-10" : "w-8 h-8"}
              rounded-full
              ${isCompleted
                ? "bg-golden-400 text-white"
                : isCurrent
                  ? "bg-golden-500 text-white ring-4 ring-golden-200"
                  : "bg-gray-200 text-gray-400"
              }
              ${isAccessible ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
            `}
            title={step.title}
          >
            <span className="text-sm">{step.icon}</span>

            {isCurrent && (
              <motion.div
                className="absolute -inset-1 rounded-full border-2 border-golden-400"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
