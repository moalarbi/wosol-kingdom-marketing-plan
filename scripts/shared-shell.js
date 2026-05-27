const hubPages = [
  { key: 'hub', label: 'Hub', href: '/' },
  { key: 'marketing-plan', label: 'Marketing Strategy', href: '/marketing-plan/' },
  { key: 'uniform-system', label: 'Uniform & Trolley', href: '/uniform-system/' },
  { key: 'booth-experience', label: 'Booth Experience', href: '/booth-experience/' },
  { key: 'promo-film', label: 'Promo Film', href: '/promo-film/' },
  { key: 'marketing-budget', label: 'Budget', href: '/marketing-budget/' },
  { key: 'idea-bank', label: 'Idea Bank', href: '/idea-bank/' },
];

function createLogo(className) {
  const logo = document.createElement('a');
  logo.className = className;
  logo.href = '/';
  logo.setAttribute('aria-label', 'WOSOL Concierge');

  const name = document.createElement('span');
  name.className = 'logo-name';
  name.textContent = 'WOSOL';

  const sub = document.createElement('span');
  sub.className = 'logo-sub';
  sub.textContent = 'CONCIERGE';

  logo.append(name, sub);
  return logo;
}

function renderHeader(target) {
  const header = document.createElement('header');
  header.className = `site-header ${target.dataset.headerClass || ''}`.trim();

  const meta = document.createElement('div');
  meta.className = 'header-meta';
  meta.textContent = target.dataset.headerMeta || 'Executive Strategy Hub · Kingdom Centre · 2026';

  header.append(meta, createLogo('logo-block'));
  target.replaceWith(header);
}

function renderNav(target) {
  const current = target.dataset.currentPage || 'hub';
  const nav = document.createElement('nav');
  nav.className = 'hub-nav en';
  nav.setAttribute('aria-label', 'Strategy hub navigation');

  const pages = current === 'hub'
    ? hubPages.filter((page) => page.key !== 'hub')
    : hubPages;

  pages.forEach((page) => {
    const link = document.createElement('a');
    link.href = page.href;
    link.textContent = page.label;
    if (page.key === current) {
      link.setAttribute('aria-current', 'page');
    }
    nav.append(link);
  });

  target.replaceWith(nav);
}

function renderFooter(target) {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';

  const logo = createLogo('footer-logo');
  const kingdomLogo = document.createElement('a');
  kingdomLogo.className = 'footer-kingdom-logo';
  kingdomLogo.href = '/';
  kingdomLogo.setAttribute('aria-label', 'Kingdom Centre');

  const kingdomImg = document.createElement('img');
  kingdomImg.src = '/assets/brand/almamlaka-logo.png?v=kingdom-logo-new';
  kingdomImg.alt = '';
  kingdomLogo.append(kingdomImg);

  const lockup = document.createElement('div');
  lockup.className = 'footer-brand-lockup';
  lockup.append(logo, kingdomLogo);

  const meta = document.createElement('div');
  meta.className = 'footer-meta';
  meta.textContent = target.dataset.footerMeta || 'Confidential · Executive Strategy Hub · 2026';

  footer.append(meta, lockup);
  target.replaceWith(footer);
}

document.querySelectorAll('[data-shell-header]').forEach(renderHeader);
document.querySelectorAll('[data-shell-nav]').forEach(renderNav);
document.querySelectorAll('[data-shell-footer]').forEach(renderFooter);
