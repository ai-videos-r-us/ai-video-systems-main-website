// AI Video Systems — landing page interactions

document.addEventListener('DOMContentLoaded', () => {
  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach((other) => other.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // Sticky header shadow on scroll
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    header.style.boxShadow = window.scrollY > 8 ? '0 4px 16px rgba(11,11,13,0.08)' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Funnel X-Ray interactivity
  const xrayBars = document.querySelectorAll('.xray-bar');
  const xrayPanels = document.querySelectorAll('.xray-panel');

  xrayBars.forEach((bar) => {
    bar.addEventListener('click', () => {
      const stage = bar.dataset.stage;

      xrayBars.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      bar.classList.add('is-active');
      bar.setAttribute('aria-selected', 'true');

      xrayPanels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.panel === stage);
      });
    });
  });

  // Proof metrics modal
  const proofModal = document.getElementById('proof-modal');
  const proofDetails = {
    'proof-1': { label: '5M+ Views', title: 'Ironclad Finance — 5M+ Views', copy: 'A single AI video creative library reached over 5 million views across paid and organic placements in 7 weeks.' },
    'proof-2': { label: '74 Leads', title: '74 Qualified Leads in 7 Weeks', copy: 'Every one of these leads was tracked from first video view through to a booked enquiry using our signal pipeline.' },
    'proof-3': { label: '32% Conversion', title: '32% Lead-to-Job Conversion', copy: 'Warmed leads convert far above cold-traffic averages because they arrive having already watched trust-building content.' },
    'proof-4': { label: '150K+ Views', title: 'Mortgage Fit — 150K+ Views in 5 Weeks', copy: '150,000+ views and 25+ qualified leads generated within the first 5 weeks of launch.' },
  };

  if (proofModal) {
    const shot = proofModal.querySelector('.proof-modal-shot');
    const title = proofModal.querySelector('.proof-modal-title');
    const copy = proofModal.querySelector('.proof-modal-copy');

    document.querySelectorAll('.proof-tile').forEach((tile) => {
      tile.addEventListener('click', () => {
        const detail = proofDetails[tile.dataset.modal];
        if (!detail) return;
        shot.setAttribute('data-label', detail.label);
        title.textContent = detail.title;
        copy.textContent = detail.copy;
        proofModal.classList.add('is-open');
        proofModal.setAttribute('aria-hidden', 'false');
      });
    });

    proofModal.querySelectorAll('[data-modal-close]').forEach((el) => {
      el.addEventListener('click', () => {
        proofModal.classList.remove('is-open');
        proofModal.setAttribute('aria-hidden', 'true');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        proofModal.classList.remove('is-open');
        proofModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Portfolio filter
  const portfolioFilters = document.querySelectorAll('.portfolio-filter');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  const applyPortfolioFilter = (filter) => {
    portfolioItems.forEach((item) => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('is-visible', show);
    });
  };

  portfolioFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      portfolioFilters.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      applyPortfolioFilter(btn.dataset.filter);
    });
  });

  applyPortfolioFilter('all');
});
