import { Check } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: number;
  isDarkMode?: boolean;
}

export function ProgressStepper({ currentStep, isDarkMode = false }: ProgressStepperProps) {
  const steps = [
    { label: 'Registered', number: 0 },
    { label: 'FIR Filed', number: 1 },
    { label: 'Bank Notified', number: 2 },
    { label: 'Funds Frozen', number: 3 },
    { label: 'Recovery', number: 4 },
    { label: 'Refund', number: 5 }
  ];

  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isUpcoming = step.number > currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-blue-600 border-blue-600'
                    : isCurrent
                    ? 'bg-white border-blue-600'
                    : 'bg-white border-gray-300'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <span
                    className={`${
                      isCurrent ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    {step.number + 1}
                  </span>
                )}
              </div>
              <span
                className={`mt-2 text-center max-w-[80px] ${
                  isCompleted || isCurrent 
                    ? isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    : isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}