
import { cn } from "@/lib/utils";

interface BadgeProps {
  status: 'pending' | 'in-progress' | 'completed' | 'issue';
  className?: string;
}

const Badge = ({ status, className }: BadgeProps) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'issue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'in-progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'issue':
        return 'Problème';
      default:
        return status;
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        getStatusClasses(),
        className
      )}
    >
      {getStatusText()}
    </span>
  );
};

export default Badge;
// This code defines a reusable Badge component that displays different statuses with appropriate styles.
// It uses the `cn` utility for conditional class names and applies different background and text colors based on the status prop.