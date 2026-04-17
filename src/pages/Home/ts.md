 {/* ──────────── HERO + REEL ──────────── */}
        <RevealSection>
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 lg:gap-6 ">
            
            <article className="xl:col-span-7 bg-surface rounded-xl border border-border p-6 md:p-8 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted font-medium">
                  {hero.eyebrow || 'Creative Developer'}
                </p>
                <h1 className="font-display text-3xl md:text-[2.75rem] lg:text-5xl leading-[1.1] text-text-primary max-w-3xl">
                  {hero.title || 'I build interactive software, games, and digital experiences.'}
                </h1>

                <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
                  {hero.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button to={hero.ctaLink || '/projects'} variant="primary" size="md">
                  {hero.ctaLabel || 'View Featured Projects'}
                </Button>
                <Button to="/work/deadly-nightshade" variant="secondary" size="md">
                  View flagship project
                </Button>
                {/* {contact?.github && (
                  <a href={contact.github} target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                    github profile →
                  </a>
                )} */}
              </div>
            </article>

            <article className="xl:col-span-5 bg-surface rounded-xl border border-border p-4 md:p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-text-primary">{reel.title || 'Video Reel'}</h2>
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-semibold bg-bg px-2 py-0.5 rounded">Featured</span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">{reel.description || 'A short preview of selected work.'}</p>
              <VideoPlayer
                src={reel.video || '/works/deadly/videoLow.mp4'}
                poster={reel.poster || '/works/deadly/cover2.jpg'}
                className="flex-1 min-h-[14rem] md:min-h-[16rem]"
              />
            </article>
          </section>
        </RevealSection>

        <RevealSection>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {spotlightStats.map((item) => (
              <article key={item.label} className="bg-surface border border-border rounded-xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-text-muted">{item.label}</p>
                <p className="text-sm md:text-base text-text-primary font-semibold mt-1">{item.value}</p>
              </article>
            ))}
          </section>
        </RevealSection>

        {/* ──────────── CAPABILITIES STRIP ──────────── */}
        <RevealSection>
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg md:text-xl font-bold text-text-primary">Capabilities</h2>
            </div>
            <DraggableStrip
              className="rounded-xl border border-border bg-surface/60 py-3 px-2"
              label="Scrolling list of skills"
            >
              {tripleSkills.map((skill, index) => (
                <span key={`${skill}-${index}`} className="skill-chip">
                  {skill}
                </span>
              ))}
            </DraggableStrip>
          </section>
        </RevealSection>