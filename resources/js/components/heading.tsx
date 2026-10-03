export default function Heading({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-4 space-y-2">
            <h1 className="!text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-neutral-900 dark:text-white md:!text-[2.1rem]">{title}</h1>
            {description && <p className="text-muted-foreground text-sm leading-relaxed dark:text-[#A4A1B8] md:text-[0.95rem]">{description}</p>}
        </div>
    );
}
