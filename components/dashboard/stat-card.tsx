import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'danger' | 'info';
}

const iconColors = {
  default: 'text-zinc-600',
  success: 'text-green-500',
  danger: 'text-red-500',
  info: 'text-blue-500',
};

const StatCard = ({ title, value, icon, trend, variant = 'default' }: StatCardProps) => {
  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs md:text-sm font-medium text-zinc-500">{title}</p>
            <div className="mt-1 md:mt-2 flex items-baseline gap-2">
              <h3 className="text-xl md:text-2xl font-bold text-white">{value}</h3>
              {trend && (
                <span
                  className={cn(
                    'text-xs md:text-sm font-medium',
                    trend.isPositive ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {trend.isPositive ? '↑' : '↓'} {trend.value}
                </span>
              )}
            </div>
          </div>
          {icon && (
            <div className={cn('p-2 md:p-3 rounded-lg bg-zinc-900/50', iconColors[variant])}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;