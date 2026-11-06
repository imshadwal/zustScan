export function PageIntro({
  eyebrow,
  title,
  description,
  className = "bg-mist-deep",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-6xl px-4 pt-32 pb-16 sm:pt-40 lg:pt-48 lg:pb-24">
        <p className="caption-1 text-muted">{eyebrow}</p>
        <h1 className="heading-1 mt-4 max-w-[680px]">
          <span className="hero-heading">{title}</span>
        </h1>
        {description ? (
          <p className="body-1 mt-6 max-w-[680px] text-muted">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
