import { CheckCircle, Clock, Circle } from 'lucide-react';

interface Activity {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface ActivityTimelineProps {
  activities: Activity[];
  isDarkMode?: boolean;
}

export function ActivityTimeline({ activities, isDarkMode = false }: ActivityTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="relative">
      {activities.map((activity, index) => (
        <div key={index} className="relative pb-8 last:pb-0">
          {/* Vertical line */}
          {index !== activities.length - 1 && (
            <div className="absolute left-[10px] top-6 bottom-0 w-0.5 bg-gray-200" />
          )}

          <div className="flex gap-4">
            {/* Icon */}
            <div className="relative z-10 flex-shrink-0">
              {getStatusIcon(activity.status)}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between mb-1">
                <h4 className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>{activity.title}</h4>
                <span className={`whitespace-nowrap ml-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{activity.date}</span>
              </div>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{activity.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}