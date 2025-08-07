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

const iconBackgrounds = {
  default: 'bg-gradient-to-br from-zinc-800 to-zinc-900',
  success: 'bg-gradient-to-br from-green-900/50 to-green-950/50',
  danger: 'bg-gradient-to-br from-red-900/50 to-red-950/50',
  info: 'bg-gradient-to-br from-blue-900/50 to-blue-950/50',
};

const iconColors = {
  default: 'text-zinc-400',
  success: 'text-green-400',
  danger: 'text-red-400',
  info: 'text-blue-400',
};

const StatCard = ({ title, value, icon, trend, variant = 'default' }: StatCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      <CardContent className="p-4 relative z-10">
        <div className="flex items-start justify-between h-full">
          <div className="flex-1 flex flex-col justify-between">
            <p className="text-xs md:text-sm font-medium text-zinc-400 uppercase tracking-wider mb-1">{title}</p>
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-white tracking-tight whitespace-nowrap">{value}</h3>
              {trend && (
                <div>
                  <span
                    className={cn(
                      'text-xs font-medium inline-flex items-center gap-0.5',
                      trend.isPositive ? 'text-green-400' : 'text-red-400'
                    )}
                  >
                    <span className="text-xs">{trend.isPositive ? '↑' : '↓'}</span>
                    <span>{trend.value}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
          {icon && (
            <div className={cn(
              'p-2 shadow-inner flex-shrink-0',
              iconBackgrounds[variant]
            )}>
              <div className={cn('transform group-hover:scale-110 transition-transform duration-300', iconColors[variant])}>
                {icon}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;