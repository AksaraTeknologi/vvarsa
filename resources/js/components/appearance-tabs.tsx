import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.roles?.includes('admin') || auth.user?.role === 'admin';

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    return (
        <div
            className={cn(
                'appearance-tabs inline-flex gap-1 rounded-2xl border p-1',
                isAdmin
                    ? 'border-[#DCD8FF] bg-[#F4F2FF] dark:border-[#2f3154] dark:bg-[#1e1f38]'
                    : 'staff-appearance-tabs border-[#4ec77e]/30 bg-[#0e221b] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]',
                className,
            )}
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
                            ? isAdmin
                                ? 'shadow-[0_4px_14px_rgba(94,75,242,0.3)]'
                                : 'shadow-[0_8px_20px_rgba(63,149,103,0.25)]'
                            : isAdmin
                              ? 'text-[#686673] hover:bg-[#EAE7FE] hover:text-[#5E4BF2] dark:text-[#8d8ba7] dark:hover:bg-[#28294a] dark:hover:text-white'
                              : 'text-[#d8f3e2] hover:bg-[#17392d] hover:text-[#f4fff8]',
                    )}
                    style={
                        appearance === value
                            ? {
                                  backgroundColor: isAdmin ? '#5E4BF2' : '#3f9567',
                                  color: '#ffffff',
                                  boxShadow: isAdmin ? '0 4px 14px rgba(94,75,242,0.3)' : '0 8px 20px rgba(63,149,103,0.25)',
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

