"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const STEP_ICONS = ["🔇", "🎯", "☀️", "📝", "🏃", "📈"];
const STEP_IDS = [1, 2, 3, 4, 5, 6];

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export function StepIndicator({ currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
  const t = useTranslations("steps");

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {STEP_IDS.map((stepId, index) => {
        const isCompleted = completedSteps.includes(stepId);
        const isCurrent = currentStep === stepId;
        const isAccessible = isCompleted || stepId <= Math.max(...completedSteps, 0) + 1;

        return (
          <motion.button
            key={stepId}
            whileHover={isAccessible ? { scale: 1.1 } : {}}
            whileTap={isAccessible ? { scale: 0.95 } : {}}
            onClick={() => isAccessible && onStepClick(stepId)}
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
            title={t(`step${stepId}.title`)}
          >
            <span className="text-sm">{STEP_ICONS[index]}</span>

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
