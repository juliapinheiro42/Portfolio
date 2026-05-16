export interface ReconstructionModule {
  readonly label: string;
  readonly progress: number;
}

export interface ReconstructionConfig {
  readonly enabled: boolean;
  readonly totalDurationMs: number;
  readonly reducedMotionDurationMs: number;
  readonly glitchStartMs: number;
  readonly glitchEndMs: number;
  readonly statusLines: readonly string[];
  readonly modules: readonly ReconstructionModule[];
}

export const HERO_RECONSTRUCTION_CONFIG: ReconstructionConfig = {
  enabled: true,
  totalDurationMs: 3400,
  reducedMotionDurationMs: 700,
  glitchStartMs: 920,
  glitchEndMs: 1380,
  statusLines: [
    '[rebuild] restoring visual layer',
    '[ui] aligning hero modules',
    '[motion] stabilizing depth system',
    '[status] interface reconstructed'
  ],
  modules: [
    { label: 'HERO_CORE', progress: 96 },
    { label: 'PROFILE_SIGNAL', progress: 88 },
    { label: 'TERMINAL_LAYER', progress: 92 },
    { label: 'MASCOT_THREAD', progress: 84 },
    { label: 'CTA_GATEWAY', progress: 90 },
    { label: 'DREAM_UI', progress: 98 }
  ]
};
