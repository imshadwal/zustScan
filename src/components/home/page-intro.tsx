export function PageIntro({
  eyebrow,
  title,
  description,
  className = "bg-mist",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-6xl px-5 pt-32 pb-10 sm:px-6 lg:pt-36 lg:pb-14">
        <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
