export interface SocialLink {
  readonly label: string;
  readonly href: string;
  readonly meta: string;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/juliapinheiro42',
    meta: '@juliapinheiro42'
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/juliapinheirodefarias/',
    meta: '/in/juliapinheirodefarias'
  },
  {
    label: 'E-mail',
    href: 'mailto:juliapinheiro.142@gmail.com',
    meta: 'juliapinheiro.142@gmail.com'
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/5521989124775',
    meta: '+55 21 98912-4775'
  },
  {
    label: 'Resume',
    href: '/julia-farias-dev-resume.pdf',
    meta: 'PDF · Julia Farias DEV'
  }
];
