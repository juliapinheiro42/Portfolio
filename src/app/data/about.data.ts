export interface SystemModule {
  readonly label: string;
  readonly title: string;
  readonly items: readonly string[];
}

export interface SystemStat {
  readonly value: string;
  readonly label: string;
}

export interface ProfileLine {
  readonly key: string;
  readonly value: string;
}

export const ABOUT_MODULES: readonly SystemModule[] = [
  {
    label: 'Core Languages',
    title: 'Language Layer',
    items: [
      'Build backend services with C# and .NET',
      'Create AI/API prototypes with Python',
      'Structure typed interfaces with TypeScript',
      'Write data queries and models with SQL'
    ]
  },
  {
    label: 'Backend',
    title: 'API Layer',
    items: [
      'Build REST APIs with ASP.NET Core',
      'Model relational data with EF Core',
      'Implement authentication and authorization flows',
      'Document endpoints with Swagger',
      'Structure services using layered/clean architecture'
    ]
  },
  {
    label: 'Frontend',
    title: 'Interface Layer',
    items: [
      'Build responsive interfaces with React and Angular',
      'Create component-based UI with TypeScript',
      'Design accessible flows for real user tasks',
      'Use motion and visual hierarchy without hurting readability'
    ]
  },
  {
    label: 'Salesforce',
    title: 'Automation Layer',
    items: [
      'Automate business flows with Salesforce Flows',
      'Write Apex logic for custom processes',
      'Build Lightning Web Components for support workflows',
      'Expose and consume REST resources',
      'Create validation rules, reports and dashboards'
    ]
  },
  {
    label: 'AI & Data',
    title: 'Intelligence Layer',
    items: [
      'Prototype recommendation and decision-support flows',
      'Experiment with LLM agents and structured prompts',
      'Explore optimization and AI research workflows',
      'Build data-driven prototypes with Streamlit and SQLAlchemy'
    ]
  },
  {
    label: 'Tools',
    title: 'Build Layer',
    items: [
      'Version and review code with Git and GitHub',
      'Containerize local environments with Docker',
      'Test and inspect APIs with Postman',
      'Organize development workflow in VS Code'
    ]
  }
];

export const ABOUT_STATS: readonly SystemStat[] = [
  { value: 'API', label: 'backend services' },
  { value: 'AI', label: 'product prototypes' },
  { value: 'CRM', label: 'Salesforce automation' },
  { value: 'UI', label: 'expressive interfaces' }
];

export const PROFILE_LINES: readonly ProfileLine[] = [
  { key: 'name', value: "'Julia Pinheiro'" },
  { key: 'role', value: "'Full Stack Developer'" },
  { key: 'focus', value: "['APIs', 'AI prototypes', 'Salesforce']" },
  { key: 'frontend', value: "['React', 'Next.js', 'TypeScript']" },
  { key: 'backend', value: "['C#', '.NET', 'Python']" },
  { key: 'status', value: "'building technical projects'" }
];
