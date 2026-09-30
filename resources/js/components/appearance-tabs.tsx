import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    return (
        <div
            className={cn('appearance-tabs staff-appearance-tabs inline-flex gap-1 rounded-2xl border border-[#4ec77e]/30 bg-[#0e221b] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]', className)}
            data-appearance={appearance}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    data-appearance-value={value}
                    className={cn(
                        'flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
                        appearance === value
                            ? 'shadow-[0_8px_20px_rgba(63,149,103,0.25)]'
                            : 'text-[#d8f3e2] hover:bg-[#17392d] hover:text-[#f4fff8]',
                    )}
                    style={
                        appearance === value
                            ? {
                                  backgroundColor: '#3f9567',
                                  color: '#ffffff',
                                  boxShadow: '0 8px 20px rgba(63,149,103,0.25)',
                              }
                            : undefined
                    }
                >
                    <Icon className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5">{label}</span>
                </button>
            ))}
        </div>
    );
}

