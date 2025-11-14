import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isDarkMode
          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
      }`}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? (
        <>
          <Sun className="h-5 w-5" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
}
