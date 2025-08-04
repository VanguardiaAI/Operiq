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

export default function StatCard({
  title,
  value,
  icon,
  trend,
  variant = 'default',
}: StatCardProps) {
  return (
    <Card className="bg-black border border-zinc-900/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <p className="text-sm font-normal text-zinc-500">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {trend && (
              <p
                className={cn(
                  'text-xs flex items-center gap-1',
                  trend.isPositive ? 'text-green-500' : 'text-red-500'
                )}
              >
                <span className="text-lg">
                  {trend.isPositive ? '↗' : '↘'}
                </span>
                {trend.value}
              </p>
            )}
          </div>
          {icon && (
            <div className={iconColors[variant]}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}