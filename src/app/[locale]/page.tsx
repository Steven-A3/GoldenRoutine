"use client";

import { useMemo } from "react";
import { useRoutine } from "@/hooks/useRoutine";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { StepIndicator } from "@/components/StepIndicator";
import { CompletionScreen } from "@/components/CompletionScreen";
import {
  Step1DigitalDetox,
  Step2Intentions,
  Step3Weather,
  Step4Journaling,
  Step5Tasks,
  Step6Market,
} from "@/components/steps";
import { AdBanner } from "@/components/AdBanner";
import { LanguageSelector } from "@/components/LanguageSelector";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { PersonalTask } from "@/types/routine";

export default function Home() {
  const t = useTranslations();

  const defaultTasks: PersonalTask[] = useMemo(() => [
    { id: "1", title: t("steps.step5.defaultTasks.stretch"), completed: false, category: "exercise" },
    { id: "2", title: t("steps.step5.defaultTasks.water"), completed: false, category: "health" },
    { id: "3", title: t("steps.step5.defaultTasks.priority"), completed: false, category: "personal" },
  ], [t]);

  const {
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
  } = useRoutine({ defaultTasks });

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-golden-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const isRoutineStarted = progress.startedAt !== null;
  const isRoutineCompleted = progress.completedSteps.length === 6;

  if (!isRoutineStarted) {
    return <WelcomeScreen onStart={startRoutine} />;
  }

  if (isRoutineCompleted) {
    return (
      <CompletionScreen
        intention={intention}
        journal={journal}
        tasks={tasks}
        startedAt={progress.startedAt}
        completedAt={progress.completedAt}
        onReset={resetRoutine}
      />
    );
  }

  const renderCurrentStep = () => {
    switch (progress.currentStep) {
      case 1:
        return <Step1DigitalDetox onComplete={() => completeStep(1)} />;
      case 2:
        return (
          <Step2Intentions
            intention={intention}
            onUpdate={updateIntention}
            onComplete={() => completeStep(2)}
          />
        );
      case 3:
        return <Step3Weather onComplete={() => completeStep(3)} />;
      case 4:
        return (
          <Step4Journaling
            journal={journal}
            onUpdate={updateJournal}
            onComplete={() => completeStep(4)}
          />
        );
      case 5:
        return (
          <Step5Tasks
            tasks={tasks}
            onToggle={toggleTask}
            onAdd={addTask}
            onComplete={() => completeStep(5)}
          />
        );
      case 6:
        return <Step6Market onComplete={() => completeStep(6)} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <header className="sticky top-0 z-50 glass safe-top">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <h1 className="text-lg font-bold text-golden-600">{t("app.name")}</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {t("progress.completed", { count: progress.completedSteps.length })}
              </span>
              <LanguageSelector />
            </div>
          </div>
          <StepIndicator
            currentStep={progress.currentStep}
            completedSteps={progress.completedSteps}
            onStepClick={goToStep}
          />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={progress.currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="relative z-30"
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 safe-bottom z-20 pointer-events-none">
        <div className="pointer-events-auto w-fit mx-auto">
          <AdBanner slot="morning-golden-time-footer" format="horizontal" className="max-w-md" />
        </div>
      </div>
    </main>
  );
}
