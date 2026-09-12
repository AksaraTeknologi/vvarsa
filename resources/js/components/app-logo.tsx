import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-xl p-1.5 overflow-hidden shadow-xs shrink-0">
                <AppLogoIcon className="size-full object-contain" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate leading-none font-bold tracking-tight text-foreground">VVARSA</span>
            </div>
        </div>
    );
}