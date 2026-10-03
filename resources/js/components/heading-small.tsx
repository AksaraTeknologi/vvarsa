export default function HeadingSmall({ title, description }: { title: string; description?: string }) {
    return (
        <header className="space-y-2">
            <h3 className="text-lg font-semibold leading-tight text-neutral-900 dark:text-white">{title}</h3>
            {description && <p className="text-muted-foreground text-sm leading-relaxed dark:text-[#A4A1B8]">{description}</p>}
        </header>
    );
}
