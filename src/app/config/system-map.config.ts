export type SystemNodeKind =
  | 'frontend'
  | 'gateway'
  | 'auth'
  | 'queue'
  | 'service'
  | 'database'
  | 'observability';

export interface SystemNode {
  id: string;
  label: string;
  detail: string;
  kind: SystemNodeKind;
  x: number;
  y: number;
  priority?: 'primary' | 'secondary' | 'quiet';
}

export interface SystemConnection {
  id: string;
  from: string;
  to: string;
  path: string;
  intensity?: 'high' | 'medium' | 'low';
}

export interface SystemEventParticle {
  id: string;
  connectionId: string;
  duration: number;
  delay: number;
  size: number;
  tone: 'pink' | 'blue' | 'lilac' | 'white';
}

export interface SystemMapConfig {
  particleCountDesktop: number;
  particleCountMobile: number;
  nodes: SystemNode[];
  connections: SystemConnection[];
  particles: SystemEventParticle[];
}

export const SYSTEM_MAP_CONFIG: SystemMapConfig = {
  particleCountDesktop: 8,
  particleCountMobile: 3,
  nodes: [
    {
      id: 'frontend',
      label: 'UI',
      detail: 'UI layer',
      kind: 'frontend',
      x: 20,
      y: 26,
      priority: 'quiet'
    },
    {
      id: 'gateway',
      label: 'Gate',
      detail: 'Routing',
      kind: 'gateway',
      x: 42,
      y: 38,
      priority: 'quiet'
    },
    {
      id: 'rabbitmq',
      label: 'RabbitMQ',
      detail: 'Event bus',
      kind: 'queue',
      x: 62,
      y: 52,
      priority: 'primary'
    },
    {
      id: 'services',
      label: 'Svc',
      detail: 'Domains',
      kind: 'service',
      x: 86,
      y: 30,
      priority: 'quiet'
    },
    {
      id: 'trace',
      label: 'Trace',
      detail: 'Signals',
      kind: 'observability',
      x: 78,
      y: 78,
      priority: 'quiet'
    }
  ],
  connections: [
    {
      id: 'path-frontend-gateway',
      from: 'frontend',
      to: 'gateway',
      path: 'M118 134 C188 92 252 158 304 198',
      intensity: 'low'
    },
    {
      id: 'path-gateway-rabbitmq',
      from: 'gateway',
      to: 'rabbitmq',
      path: 'M306 198 C354 224 398 238 446 270',
      intensity: 'medium'
    },
    {
      id: 'path-rabbitmq-services',
      from: 'rabbitmq',
      to: 'services',
      path: 'M450 266 C510 188 572 150 642 142',
      intensity: 'medium'
    },
    {
      id: 'path-services-trace',
      from: 'services',
      to: 'trace',
      path: 'M640 152 C616 252 600 340 560 404',
      intensity: 'low'
    },
    {
      id: 'path-rabbitmq-trace',
      from: 'rabbitmq',
      to: 'trace',
      path: 'M448 276 C494 338 524 374 560 404',
      intensity: 'low'
    },
    {
      id: 'path-ghost-loop',
      from: 'rabbitmq',
      to: 'frontend',
      path: 'M448 276 C332 430 190 390 96 286',
      intensity: 'low'
    }
  ],
  particles: [
    { id: 'event-01', connectionId: 'path-frontend-gateway', duration: 12.4, delay: 1.6, size: 2.8, tone: 'pink' },
    { id: 'event-02', connectionId: 'path-gateway-rabbitmq', duration: 10.6, delay: 4.2, size: 3.2, tone: 'blue' },
    { id: 'event-03', connectionId: 'path-ghost-loop', duration: 13.8, delay: 6.8, size: 2.8, tone: 'lilac' },
    { id: 'event-04', connectionId: 'path-rabbitmq-services', duration: 11.8, delay: 8.6, size: 2.8, tone: 'white' },
    { id: 'event-05', connectionId: 'path-rabbitmq-trace', duration: 14.6, delay: 10.2, size: 2.6, tone: 'blue' },
    { id: 'event-06', connectionId: 'path-services-trace', duration: 16.2, delay: 3.5, size: 2.4, tone: 'lilac' },
    { id: 'event-07', connectionId: 'path-rabbitmq-services', duration: 13.4, delay: 12.1, size: 2.6, tone: 'pink' }
  ]
};
