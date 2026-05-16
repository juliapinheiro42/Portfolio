import { SectionVariant } from '../shared/section-shell/section-shell.component';

export interface SectionStateConfig {
  readonly mood: string;
  readonly stage: string;
  readonly revealStepMs: number;
  readonly revealMaxMs: number;
  readonly signalMinMs: number;
  readonly signalMaxMs: number;
  readonly cssVars: Record<string, string>;
}

export const SECTION_STATES: Record<SectionVariant, SectionStateConfig> = {
  hero: {
    mood: 'awakening',
    stage: 'boot.sequence',
    revealStepMs: 70,
    revealMaxMs: 420,
    signalMinMs: 6500,
    signalMaxMs: 16000,
    cssVars: {
      '--state-energy': '0.92',
      '--state-particles': '0.62',
      '--state-grid': '0.16',
      '--state-glow': '0.26',
      '--state-speed': '1'
    }
  },
  about: {
    mood: 'contemplative',
    stage: 'human.profile',
    revealStepMs: 115,
    revealMaxMs: 560,
    signalMinMs: 16000,
    signalMaxMs: 30000,
    cssVars: {
      '--state-energy': '0.42',
      '--state-particles': '0.28',
      '--state-grid': '0.07',
      '--state-glow': '0.18',
      '--state-speed': '1.55'
    }
  },
  projects: {
    mood: 'operational',
    stage: 'services.online',
    revealStepMs: 86,
    revealMaxMs: 520,
    signalMinMs: 4800,
    signalMaxMs: 12000,
    cssVars: {
      '--state-energy': '0.86',
      '--state-particles': '0.68',
      '--state-grid': '0.15',
      '--state-glow': '0.3',
      '--state-speed': '0.82'
    }
  },
  contact: {
    mood: 'transmission',
    stage: 'connection.open',
    revealStepMs: 140,
    revealMaxMs: 620,
    signalMinMs: 18000,
    signalMaxMs: 34000,
    cssVars: {
      '--state-energy': '0.34',
      '--state-particles': '0.22',
      '--state-grid': '0.045',
      '--state-glow': '0.16',
      '--state-speed': '1.85'
    }
  }
};
