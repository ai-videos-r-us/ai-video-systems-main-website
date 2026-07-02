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
    header.style.boxShadow = window.scrollY > 8 ? '0 8px 24px rgba(0,0,0,0.35)' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
