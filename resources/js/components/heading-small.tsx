export default function HeadingSmall({ title, description }: { title: string; description?: string }) {
    return (
        <header className="space-y-2">
            <h3 className="text-lg font-semibold leading-tight text-[#1f2a23]">{title}</h3>
            {description && <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>}
        </header>
    );
}
