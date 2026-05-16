export type ProjectStatus = 'online' | 'building' | 'archived';
export type ProjectFilter = 'All' | 'AI' | 'Backend' | 'Salesforce' | 'Full Stack';
export type RuntimeNodeKind = 'client' | 'gateway' | 'service' | 'broker' | 'database' | 'workflow' | 'ai' | 'render';
export type RuntimePathTone = 'event' | 'sync' | 'data' | 'control';

export interface RuntimeNode {
  readonly id: string;
  readonly label: string;
  readonly role: string;
  readonly kind: RuntimeNodeKind;
  readonly x: number;
  readonly y: number;
}

export interface RuntimePath {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly d: string;
  readonly tone: RuntimePathTone;
  readonly emergency?: boolean;
}

export interface RuntimeEvent {
  readonly label: string;
  readonly pathId: string;
  readonly delay: number;
  readonly duration: number;
  readonly emergency?: boolean;
}

export interface RuntimeInspection {
  readonly summary: string;
  readonly focus: string;
  readonly simulationLabel: string;
  readonly nodes: readonly RuntimeNode[];
  readonly paths: readonly RuntimePath[];
  readonly events: readonly RuntimeEvent[];
  readonly metrics: readonly {
    readonly label: string;
    readonly normal: string;
    readonly active: string;
  }[];
  readonly normalLogs: readonly string[];
  readonly activeLogs: readonly string[];
  readonly capabilities: readonly string[];
}

export interface TechnicalBreakdown {
  readonly problem: string;
  readonly solution: string;
  readonly architectureDecisions: readonly string[];
  readonly challenges: readonly string[];
  readonly tradeoffs: readonly string[];
  readonly messagingFlow: readonly string[];
  readonly scaling: readonly string[];
  readonly stack: readonly string[];
}

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly caseLabel: string;
  readonly subtitle: string;
  readonly description: string;
  readonly status: ProjectStatus;
  readonly complexity: 'Low' | 'Medium' | 'High';
  readonly projectStatus: string;
  readonly ctaLabel: string;
  readonly featured?: boolean;
  readonly type: string;
  readonly serviceName: string;
  readonly serviceKind: string;
  readonly health: string;
  readonly architecture: readonly {
    readonly label: string;
    readonly value: string;
  }[];
  readonly domains: readonly string[];
  readonly events: readonly string[];
  readonly logs: readonly string[];
  readonly flow: readonly string[];
  readonly systemFlow: readonly string[];
  readonly highlights: readonly string[];
  readonly problem: string;
  readonly solution: string;
  readonly myRole: string;
  readonly bossFight: string;
  readonly features: readonly string[];
  readonly intensity: 'event' | 'interface' | 'system' | 'lab';
  readonly tags: readonly string[];
  readonly githubUrl?: string;
  readonly demoUrl?: string;
  readonly caseStudyUrl?: string;
  readonly details: string;
  readonly inspection: RuntimeInspection;
  readonly technicalBreakdown: TechnicalBreakdown;
}

export const PROJECT_FILTERS: readonly ProjectFilter[] = ['All', 'AI', 'Backend', 'Salesforce', 'Full Stack'];

export const PROJECTS: readonly Project[] = [
  {
    id: 'skinmatch-ai',
    title: 'SkinMatch AI',
    caseLabel: 'CASE FILE #01',
    subtitle: 'Full-stack AI product prototype',
    description:
      'SkinMatch AI is a full-stack product prototype designed to analyze skincare products and support more personalized recommendation flows. The project is structured with a Python backend and a TypeScript web application, exploring the connection between product data, user context and intelligent skincare decision-making.',
    status: 'online',
    complexity: 'High',
    projectStatus: 'Product prototype',
    ctaLabel: 'View Case Study',
    featured: true,
    type: 'Full Stack · AI Prototype',
    serviceName: 'skinmatch-ai.product',
    serviceKind: 'featured-project',
    health: 'product prototype',
    architecture: [
      { label: 'backend', value: 'Python API layer' },
      { label: 'frontend', value: 'TypeScript web app' },
      { label: 'logic', value: 'Recommendation flow' },
      { label: 'scope', value: 'Product prototype' }
    ],
    domains: ['skincare analysis', 'product data', 'user context', 'recommendations'],
    events: ['ProductAnalyzed', 'UserContextMapped', 'RecommendationPrepared'],
    logs: ['[INFO] Product data layer mapped', '[OK] Web and API layers separated', '[INFO] Recommendation flow prototyped'],
    flow: ['Web', 'API', 'Recommendation'],
    systemFlow: ['User profile', 'Product data', 'Analysis logic', 'Recommendation flow', 'Personalized result'],
    highlights: [
      'Python backend structure',
      'TypeScript web application',
      'Full-stack product architecture',
      'AI-oriented recommendation flow'
    ],
    problem:
      'Skincare recommendations online are often generic, sponsored or disconnected from a person’s real skin profile, goals and sensitivities.',
    solution:
      'A guided full-stack prototype that connects user context, product data and recommendation-oriented logic to support clearer skincare decisions.',
    myRole:
      'Designed the product concept, structured the full-stack flow and organized the separation between interface, backend and recommendation logic.',
    bossFight:
      'Keeping the AI recommendation concept useful and explainable without making medical or dermatological claims.',
    features: [
      'Guided skincare profile',
      'Product analysis concept',
      'AI-assisted recommendation flow',
      'API/web layer separation'
    ],
    intensity: 'system',
    tags: ['Python', 'TypeScript', 'Full Stack', 'AI Prototype', 'Product Analysis', 'Recommendation Logic'],
    githubUrl: 'https://github.com/juliapinheiro42/SkinMatch-AI',
    caseStudyUrl: '/projects/skinmatch-ai',
    details:
      'Full-stack AI product prototype for skincare analysis and personalized product recommendations, focused on product logic and separation between API and web layers.',
    inspection: {
      summary: 'Full-stack product prototype connecting skincare product data, user context and recommendation-oriented logic.',
      focus: 'AI product recommendation flow',
      simulationLabel: 'Trace Recommendation',
      nodes: [
        { id: 'web', label: 'Web App', role: 'TypeScript UI', kind: 'client', x: 12, y: 28 },
        { id: 'api', label: 'Python API', role: 'backend layer', kind: 'gateway', x: 34, y: 28 },
        { id: 'product', label: 'Product Data', role: 'analysis input', kind: 'database', x: 52, y: 18 },
        { id: 'profile', label: 'User Context', role: 'preference layer', kind: 'service', x: 52, y: 66 },
        { id: 'logic', label: 'Recommendation', role: 'matching flow', kind: 'ai', x: 74, y: 44 }
      ],
      paths: [
        { id: 'web-api', from: 'Web', to: 'API', d: 'M 96 142 C 172 122, 218 122, 276 140', tone: 'sync' },
        { id: 'api-product', from: 'API', to: 'Product', d: 'M 286 136 C 338 88, 376 84, 420 92', tone: 'data' },
        { id: 'api-profile', from: 'API', to: 'Profile', d: 'M 288 152 C 346 226, 382 306, 420 318', tone: 'data' },
        { id: 'product-logic', from: 'Product', to: 'Logic', d: 'M 432 100 C 520 120, 560 170, 604 210', tone: 'event', emergency: true },
        { id: 'profile-logic', from: 'Profile', to: 'Logic', d: 'M 432 316 C 520 294, 562 252, 604 226', tone: 'event', emergency: true }
      ],
      events: [
        { label: 'ProductAnalyzed', pathId: 'api-product', delay: 0, duration: 6.2 },
        { label: 'UserContextMapped', pathId: 'api-profile', delay: 0.8, duration: 6.8 },
        { label: 'RecommendationPrepared', pathId: 'product-logic', delay: 1.2, duration: 5.8, emergency: true },
        { label: 'ContextMatched', pathId: 'profile-logic', delay: 1.6, duration: 6.1, emergency: true }
      ],
      metrics: [
        { label: 'Project Type', normal: 'prototype', active: 'prototype' },
        { label: 'API/Web Split', normal: 'yes', active: 'yes' },
        { label: 'Recommendation Flow', normal: 'mapped', active: 'tracing' },
        { label: 'Status', normal: 'technical', active: 'inspecting' }
      ],
      normalLogs: ['[INFO] Product analysis concept loaded', '[OK] API and web layers connected', '[INFO] Recommendation flow ready'],
      activeLogs: ['[TRACE] Product attributes analyzed', '[TRACE] User context matched', '[OK] Recommendation candidate prepared'],
      capabilities: ['full-stack prototype', 'product analysis', 'recommendation logic', 'API/web separation']
    },
    technicalBreakdown: {
      problem:
        'Skincare discovery can be difficult when product data, user context and recommendation criteria are not connected in a structured flow.',
      solution:
        'Built a full-stack product prototype with a Python backend and TypeScript web application to explore skincare product analysis and personalized recommendation logic.',
      architectureDecisions: [
        'Separated API and web layers to keep product logic away from interface concerns.',
        'Used Python for backend-oriented product analysis structures.',
        'Used TypeScript for a typed web application experience.',
        'Modeled the project as a prototype rather than a production recommendation system.'
      ],
      challenges: [
        'Structuring product analysis without claiming medical accuracy.',
        'Keeping recommendation logic honest and prototype-oriented.',
        'Connecting user context with product data in a readable flow.',
        'Balancing product thinking with technical implementation.'
      ],
      tradeoffs: [
        'Prototype scope allows faster iteration but does not imply production readiness.',
        'Separated layers improve maintainability but require clear contracts.',
        'Recommendation logic improves product value but needs careful validation for real-world use.'
      ],
      messagingFlow: [
        'User interacts with the TypeScript web application.',
        'Web layer sends product/context data to the backend.',
        'Python backend structures product analysis flow.',
        'Recommendation logic evaluates product and user context.',
        'A recommendation-oriented response is prepared for the interface.'
      ],
      scaling: [
        'API and web layers can evolve independently.',
        'Product data model can support richer attributes over time.',
        'Recommendation logic can be improved with more robust validation.',
        'The prototype can become a stronger product system with real datasets and testing.'
      ],
      stack: ['Python', 'TypeScript', 'Full Stack', 'AI Prototype', 'Product Analysis', 'Recommendation Logic']
    }
  },
  {
    id: 'perfumaria-ai',
    title: 'Perfumaria AI',
    caseLabel: 'CASE FILE #02',
    subtitle: 'Experimental AI research prototype',
    description:
      'Perfumaria AI is a research-oriented prototype that explores artificial intelligence applied to fragrance creation. The project combines evolutionary formula generation, molecular modeling, Bayesian optimization and LLM-based strategy to simulate perfume formulation workflows and evaluate fragrance characteristics.',
    status: 'building',
    complexity: 'High',
    projectStatus: 'Experimental research prototype',
    ctaLabel: 'Explore Experiment',
    type: 'AI · Research Prototype',
    serviceName: 'perfumaria-ai.lab',
    serviceKind: 'research-prototype',
    health: 'experiments indexing',
    architecture: [
      { label: 'optimization', value: 'Bayesian + genetic' },
      { label: 'ai runtime', value: 'LLM strategy agent' },
      { label: 'interface', value: 'Streamlit' },
      { label: 'storage', value: 'PostgreSQL' }
    ],
    domains: ['formula evolution', 'molecular modeling', 'optimization', 'fragrance behavior'],
    events: ['FormulaEvolved', 'MoleculeModeled', 'StrategyGenerated'],
    logs: ['[INFO] Formula search initialized', '[OK] Optimization loop mapped', '[INFO] LLM strategy agent connected'],
    flow: ['Formula', 'Optimization', 'Evaluation'],
    systemFlow: ['Formula data', 'Molecular modeling', 'Optimization strategy', 'LLM suggestions', 'Fragrance evaluation'],
    highlights: [
      'Genetic algorithms for formula evolution',
      'Bayesian optimization workflow',
      'LLM strategic agent using Groq/Llama',
      'Streamlit research interface'
    ],
    problem:
      'Fragrance experimentation involves many variables across formula composition, sensory behavior and optimization strategy.',
    solution:
      'A research-oriented AI prototype exploring formula generation, optimization, molecular modeling concepts and LLM-assisted strategy.',
    myRole:
      'Built the experimental AI workflow and organized the project as a prototype for research, simulation and iterative formulation exploration.',
    bossFight:
      'Combining several AI techniques while keeping the project honest as an experiment rather than presenting it as a mature scientific platform.',
    features: [
      'Formula evolution flow',
      'Bayesian optimization concept',
      'LLM strategy layer',
      'Streamlit research interface'
    ],
    intensity: 'lab',
    tags: ['Python', 'PyTorch', 'Bayesian Optimization', 'LLM', 'Groq', 'Streamlit', 'PostgreSQL', 'SQLAlchemy'],
    githubUrl: 'https://github.com/juliapinheiro42/perfumaria-ai',
    details:
      'Experimental AI prototype for fragrance formula discovery and optimization, positioned as research exploration rather than a mature scientific platform.',
    inspection: {
      summary: 'Research-oriented AI prototype for fragrance formula exploration, optimization and simulated evaluation workflows.',
      focus: 'AI fragrance research pipeline',
      simulationLabel: 'Run Experiment Trace',
      nodes: [
        { id: 'formula', label: 'Formula Engine', role: 'genetic search', kind: 'ai', x: 12, y: 28 },
        { id: 'molecule', label: 'Molecular Model', role: 'GNN concept', kind: 'ai', x: 34, y: 18 },
        { id: 'optimizer', label: 'Optimizer', role: 'Bayesian loop', kind: 'workflow', x: 52, y: 42 },
        { id: 'agent', label: 'LLM Agent', role: 'strategy layer', kind: 'ai', x: 72, y: 24 },
        { id: 'simulation', label: 'Simulation', role: 'sensory behavior', kind: 'service', x: 72, y: 66 },
        { id: 'database', label: 'PostgreSQL', role: 'experiment data', kind: 'database', x: 30, y: 72 }
      ],
      paths: [
        { id: 'formula-molecule', from: 'Formula', to: 'Molecule', d: 'M 104 142 C 168 88, 222 84, 274 94', tone: 'event' },
        { id: 'molecule-optimizer', from: 'Molecule', to: 'Optimizer', d: 'M 286 106 C 352 134, 388 176, 424 214', tone: 'sync' },
        { id: 'optimizer-agent', from: 'Optimizer', to: 'Agent', d: 'M 436 208 C 510 124, 552 112, 606 122', tone: 'control', emergency: true },
        { id: 'optimizer-simulation', from: 'Optimizer', to: 'Simulation', d: 'M 438 232 C 518 294, 556 330, 602 338', tone: 'event', emergency: true },
        { id: 'optimizer-database', from: 'Optimizer', to: 'Database', d: 'M 410 236 C 344 294, 286 338, 238 356', tone: 'data' }
      ],
      events: [
        { label: 'FormulaEvolved', pathId: 'formula-molecule', delay: 0, duration: 6.1 },
        { label: 'SurrogateUpdated', pathId: 'molecule-optimizer', delay: 1.2, duration: 7.2 },
        { label: 'StrategyGenerated', pathId: 'optimizer-agent', delay: 0.7, duration: 6.4, emergency: true },
        { label: 'SimulationEvaluated', pathId: 'optimizer-simulation', delay: 2, duration: 6.8, emergency: true }
      ],
      metrics: [
        { label: 'Prototype Type', normal: 'research', active: 'research' },
        { label: 'Optimization', normal: 'mapped', active: 'running' },
        { label: 'LLM Agent', normal: 'strategy', active: 'active' },
        { label: 'Interface', normal: 'Streamlit', active: 'Streamlit' }
      ],
      normalLogs: ['[INFO] Formula evolution mapped', '[OK] Bayesian loop configured', '[INFO] Streamlit interface available'],
      activeLogs: ['[TRACE] Optimization loop running', '[TRACE] LLM strategy generated', '[OK] Simulation metrics evaluated'],
      capabilities: ['AI research prototype', 'optimization', 'LLM strategy', 'simulation concepts']
    },
    technicalBreakdown: {
      problem:
        'Fragrance formulation involves many competing variables, making it a useful domain for experimenting with AI-assisted discovery and optimization workflows.',
      solution:
        'Built a research-oriented prototype combining evolutionary formula generation, molecular modeling concepts, Bayesian optimization and an LLM strategic agent.',
      architectureDecisions: [
        'Used genetic algorithms to explore formula evolution.',
        'Modeled a Graph Neural Network concept with PyTorch Geometric.',
        'Used Bayesian optimization with Gaussian Process surrogate modeling.',
        'Added an LLM strategy layer using Groq/Llama.',
        'Used Streamlit for an interactive research interface.',
        'Structured persistence with PostgreSQL and SQLAlchemy.'
      ],
      challenges: [
        'Combining multiple AI techniques without presenting the project as a mature scientific platform.',
        'Keeping optimization and simulation concepts understandable.',
        'Representing fragrance characteristics through prototype-level logic.',
        'Balancing experimentation with code organization.'
      ],
      tradeoffs: [
        'Research prototypes allow exploration but require careful language around accuracy.',
        'Multiple AI methods create a richer experiment but increase complexity.',
        'Streamlit is fast for experimentation but not a polished product frontend.'
      ],
      messagingFlow: [
        'Formula generator proposes candidate compositions.',
        'Molecular modeling concept evaluates ingredient relationships.',
        'Bayesian optimization updates the search direction.',
        'LLM agent suggests strategic adjustments.',
        'Simulation estimates evaporation, projection and sensory behavior.',
        'Results are stored and surfaced in the Streamlit interface.'
      ],
      scaling: [
        'Optimization modules can be isolated and improved independently.',
        'Persistence can support larger experiment histories.',
        'Validation can become stricter with better datasets.',
        'The prototype can evolve into a clearer AI research dashboard.'
      ],
      stack: ['Python', 'PyTorch', 'PyTorch Geometric', 'Bayesian Optimization', 'LLM', 'Groq', 'Streamlit', 'PostgreSQL', 'SQLAlchemy', 'Pytest']
    }
  },
  {
    id: 'techcare-support',
    title: 'TechCare Support',
    caseLabel: 'CASE FILE #03',
    subtitle: 'Salesforce enterprise automation project',
    description:
      'TechCare Support is a Salesforce project for managing support requests with different flows for Standard and Premium customers. It includes SLA automation, record-triggered flows, validation rules, Apex logic, REST integration, Lightning Web Components, notifications and reporting dashboards.',
    status: 'online',
    complexity: 'Medium',
    projectStatus: 'Enterprise automation project',
    ctaLabel: 'View Case Study',
    type: 'Salesforce · Enterprise Automation',
    serviceName: 'techcare-support.salesforce',
    serviceKind: 'enterprise-automation',
    health: 'SLA automation mapped',
    architecture: [
      { label: 'platform', value: 'Salesforce' },
      { label: 'logic', value: 'Apex + Flows' },
      { label: 'interface', value: 'Lightning Web Components' },
      { label: 'integration', value: 'Apex REST' }
    ],
    domains: ['support requests', 'SLA rules', 'premium flow', 'case reporting'],
    events: ['CaseCreated', 'SlaCalculated', 'CaseReopened'],
    logs: ['[OK] Record-triggered flow mapped', '[INFO] Apex REST resource defined', '[OK] Dashboard monitoring configured'],
    flow: ['Case', 'Automation', 'Support'],
    systemFlow: ['Support request', 'Customer type', 'SLA rules', 'Apex/Flows', 'LWC interface', 'Reports'],
    highlights: ['SLA automation', 'Apex controller logic', 'Lightning Web Components', 'REST integration resource'],
    problem:
      'Support operations need different workflows for Standard and Premium customers, including SLA rules, validation and visibility.',
    solution:
      'A Salesforce automation project with custom objects, record types, flows, validation rules, Apex logic, LWCs and reporting dashboards.',
    myRole:
      'Modeled the support workflow, configured Salesforce automation rules and implemented platform logic for case visibility and interaction.',
    bossFight:
      'Coordinating SLA automation, validation rules, Apex methods and LWC interaction without turning the flow into a fragile platform setup.',
    features: [
      'Standard/Premium support flows',
      'SLA automation',
      'Apex REST resource',
      'Reports and dashboards'
    ],
    intensity: 'interface',
    tags: ['Salesforce', 'Apex', 'LWC', 'Flows', 'Validation Rules', 'REST API', 'Dashboards', 'Automation'],
    githubUrl: 'https://github.com/juliapinheiro42/TechCare-Support',
    details:
      'Salesforce support management system with SLA automation and premium customer workflows.',
    inspection: {
      summary: 'Salesforce automation project for support request management, SLA calculation and Premium/Standard customer flows.',
      focus: 'Salesforce support automation runtime',
      simulationLabel: 'Trace SLA Flow',
      nodes: [
        { id: 'case', label: 'Case Request', role: 'custom object', kind: 'client', x: 12, y: 28 },
        { id: 'flow', label: 'Record Flow', role: 'SLA automation', kind: 'workflow', x: 34, y: 22 },
        { id: 'validation', label: 'Validation', role: 'business rules', kind: 'service', x: 34, y: 68 },
        { id: 'apex', label: 'Apex Logic', role: 'controller methods', kind: 'service', x: 54, y: 42 },
        { id: 'rest', label: 'Apex REST', role: 'caseinfo API', kind: 'gateway', x: 74, y: 24 },
        { id: 'lwc', label: 'LWC', role: 'support UI', kind: 'render', x: 74, y: 66 }
      ],
      paths: [
        { id: 'case-flow', from: 'Case', to: 'Flow', d: 'M 96 142 C 168 104, 222 100, 274 112', tone: 'event' },
        { id: 'case-validation', from: 'Case', to: 'Validation', d: 'M 100 154 C 170 224, 220 300, 272 324', tone: 'control' },
        { id: 'flow-apex', from: 'Flow', to: 'Apex', d: 'M 286 120 C 350 142, 390 178, 430 210', tone: 'sync', emergency: true },
        { id: 'apex-rest', from: 'Apex', to: 'REST', d: 'M 442 202 C 510 128, 552 116, 606 122', tone: 'data' },
        { id: 'apex-lwc', from: 'Apex', to: 'LWC', d: 'M 444 230 C 520 292, 556 326, 602 338', tone: 'sync', emergency: true }
      ],
      events: [
        { label: 'CaseCreated', pathId: 'case-flow', delay: 0, duration: 6.4 },
        { label: 'RequiredFieldsChecked', pathId: 'case-validation', delay: 1.1, duration: 7 },
        { label: 'SlaCalculated', pathId: 'flow-apex', delay: 0.6, duration: 6.2, emergency: true },
        { label: 'SupportViewUpdated', pathId: 'apex-lwc', delay: 1.8, duration: 6.8, emergency: true }
      ],
      metrics: [
        { label: 'Record Types', normal: '02', active: '02' },
        { label: 'SLA Rules', normal: 'mapped', active: 'tracing' },
        { label: 'REST Resource', normal: 'caseinfo', active: 'caseinfo' },
        { label: 'Reports', normal: 'dashboards', active: 'dashboards' }
      ],
      normalLogs: ['[INFO] Case_Request__c loaded', '[OK] SLA flow ready', '[INFO] Permission and validation rules mapped'],
      activeLogs: ['[TRACE] Premium SLA calculated', '[TRACE] Apex controller method invoked', '[OK] LWC support view refreshed'],
      capabilities: ['SLA automation', 'Apex REST', 'Lightning Web Components', 'support dashboards']
    },
    technicalBreakdown: {
      problem:
        'Support teams need different workflows for Standard and Premium customers, including SLA automation, required fields and clear case monitoring.',
      solution:
        'Built a Salesforce support management project with custom objects, record types, flows, validation rules, Apex logic, REST access, LWCs and dashboards.',
      architectureDecisions: [
        'Custom object Case_Request__c for support request data.',
        'Case_History__c for case history tracking.',
        'Standard and Premium record types for different customer flows.',
        'Record-triggered flows for automatic SLA calculation.',
        'Validation rules for closing cases and required business fields.',
        'Apex REST Resource at /services/apexrest/caseinfo/{caseId}.'
      ],
      challenges: [
        'Modeling different SLA rules by customer type.',
        'Keeping business validation explicit in the Salesforce layer.',
        'Connecting Apex logic with LWC visualization and interaction.',
        'Designing dashboards that communicate support status clearly.'
      ],
      tradeoffs: [
        'Salesforce automation speeds business workflows but requires careful platform modeling.',
        'Validation rules improve data quality but can increase user friction.',
        'Apex and LWC add flexibility but require stronger testing and maintenance.'
      ],
      messagingFlow: [
        'Support request is created in Case_Request__c.',
        'Record type determines Standard or Premium flow.',
        'Record-triggered flow calculates SLA.',
        'Validation rules enforce required fields and closing rules.',
        'Apex controller handles details, reopening and contact actions.',
        'LWC and dashboards surface case information for monitoring.'
      ],
      scaling: [
        'Additional record types can support more customer tiers.',
        'Flows can evolve as SLA rules become more complex.',
        'Apex REST endpoint can support external case lookup integrations.',
        'Reports and dashboards can expand for support leadership views.'
      ],
      stack: ['Salesforce', 'Apex', 'Lightning Web Components', 'Flows', 'Validation Rules', 'REST API', 'Dashboards', 'Automation']
    }
  },
  {
    id: 'corretor-imobiliario-api',
    title: 'Corretor Imobiliário API',
    caseLabel: 'CASE FILE #04',
    subtitle: 'Backend REST API',
    description:
      'Corretor Imobiliário API is a backend project focused on property and owner management. It uses ASP.NET Core with Entity Framework Core, MySQL persistence and Swagger documentation, following a layered structure with API, Application, Domain, Infrastructure and Tests projects.',
    status: 'online',
    complexity: 'Medium',
    projectStatus: 'Backend API project',
    ctaLabel: 'View API',
    type: 'Backend · REST API',
    serviceName: 'corretor-imobiliario.api',
    serviceKind: 'backend-api',
    health: 'REST API structured',
    architecture: [
      { label: 'api', value: 'ASP.NET Core' },
      { label: 'data', value: 'EF Core + MySQL' },
      { label: 'docs', value: 'Swagger' },
      { label: 'structure', value: 'Layered solution' }
    ],
    domains: ['properties', 'owners', 'CRUD endpoints', 'API documentation'],
    events: ['PropertyCreated', 'OwnerUpdated', 'ApiDocumented'],
    logs: ['[OK] CRUD endpoints mapped', '[INFO] EF Core configured', '[OK] Swagger documentation enabled'],
    flow: ['Controller', 'Application', 'Infrastructure'],
    systemFlow: ['Controllers', 'Application layer', 'Domain models', 'Infrastructure/EF Core', 'MySQL'],
    highlights: ['ASP.NET Core REST API', 'Property and owner management', 'Entity Framework Core', 'Layered solution structure'],
    problem:
      'Real estate data needs structured backend operations for properties and owners with persistence and clear API documentation.',
    solution:
      'A practical ASP.NET Core REST API using EF Core, MySQL, Swagger and a layered solution structure.',
    myRole:
      'Implemented the backend API structure, data access flow and documentation-oriented REST endpoints for property management.',
    bossFight:
      'Keeping the API clean and practical while separating controller, application, domain and infrastructure responsibilities.',
    features: [
      'Property CRUD endpoints',
      'Owner management',
      'EF Core persistence',
      'Swagger documentation'
    ],
    intensity: 'event',
    tags: ['C#', 'ASP.NET Core', 'Entity Framework Core', 'MySQL', 'Swagger', 'REST API', 'Backend', 'Layered Architecture'],
    githubUrl: 'https://github.com/juliapinheiro42/CorretorImobiliarioAPI',
    details:
      'Clean, practical backend/API project for managing real estate properties and property owners.',
    inspection: {
      summary: 'Backend REST API for property and owner management using ASP.NET Core, EF Core, MySQL and Swagger documentation.',
      focus: 'structured backend API flow',
      simulationLabel: 'Trace API Request',
      nodes: [
        { id: 'client', label: 'API Client', role: 'request source', kind: 'client', x: 12, y: 30 },
        { id: 'controller', label: 'Controller', role: 'HTTP endpoint', kind: 'gateway', x: 32, y: 30 },
        { id: 'application', label: 'Application', role: 'use cases', kind: 'service', x: 52, y: 22 },
        { id: 'domain', label: 'Domain', role: 'entities', kind: 'service', x: 52, y: 66 },
        { id: 'infra', label: 'Infrastructure', role: 'repository', kind: 'workflow', x: 72, y: 36 },
        { id: 'mysql', label: 'MySQL', role: 'persistence', kind: 'database', x: 74, y: 70 }
      ],
      paths: [
        { id: 'client-controller', from: 'Client', to: 'Controller', d: 'M 96 148 C 160 128, 210 128, 260 146', tone: 'sync' },
        { id: 'controller-application', from: 'Controller', to: 'Application', d: 'M 272 140 C 344 100, 382 100, 424 110', tone: 'control', emergency: true },
        { id: 'application-domain', from: 'Application', to: 'Domain', d: 'M 424 122 C 404 208, 404 282, 424 318', tone: 'sync' },
        { id: 'application-infra', from: 'Application', to: 'Infrastructure', d: 'M 438 116 C 510 142, 554 168, 604 178', tone: 'data', emergency: true },
        { id: 'infra-mysql', from: 'Infrastructure', to: 'MySQL', d: 'M 608 192 C 620 244, 620 294, 610 330', tone: 'data' }
      ],
      events: [
        { label: 'RequestReceived', pathId: 'client-controller', delay: 0, duration: 6.2 },
        { label: 'UseCaseExecuted', pathId: 'controller-application', delay: 0.9, duration: 6.4, emergency: true },
        { label: 'DomainValidated', pathId: 'application-domain', delay: 1.8, duration: 7.1 },
        { label: 'EntityPersisted', pathId: 'infra-mysql', delay: 1.2, duration: 6.8 }
      ],
      metrics: [
        { label: 'API Type', normal: 'REST', active: 'REST' },
        { label: 'Persistence', normal: 'MySQL', active: 'MySQL' },
        { label: 'Docs', normal: 'Swagger', active: 'Swagger' },
        { label: 'Layers', normal: '05', active: '05' }
      ],
      normalLogs: ['[INFO] Controller route loaded', '[OK] EF Core context ready', '[INFO] Swagger documentation available'],
      activeLogs: ['[TRACE] HTTP request received', '[TRACE] Use case executed', '[OK] Entity persisted through repository'],
      capabilities: ['REST API', 'CRUD endpoints', 'layered solution', 'Swagger documentation']
    },
    technicalBreakdown: {
      problem:
        'Real estate management needs structured backend operations for properties and property owners with clear persistence and API documentation.',
      solution:
        'Built an ASP.NET Core REST API using Entity Framework Core, MySQL and Swagger, organized with API, Application, Domain, Infrastructure and Tests projects.',
      architectureDecisions: [
        'ASP.NET Core for REST API endpoints.',
        'Entity Framework Core for persistence mapping.',
        'MySQL database configuration.',
        'Swagger for API documentation.',
        'Layered solution structure with Domain, Application, Infrastructure, API and Tests.'
      ],
      challenges: [
        'Keeping CRUD endpoints organized by responsibility.',
        'Modeling properties and owners clearly.',
        'Separating API concerns from domain and infrastructure layers.',
        'Maintaining a practical structure without overselling complexity.'
      ],
      tradeoffs: [
        'Layered structure improves clarity but adds more projects/files.',
        'EF Core accelerates persistence but requires careful entity mapping.',
        'Swagger improves API usability but must stay aligned with implementation.'
      ],
      messagingFlow: [
        'API client sends a request.',
        'Controller receives the HTTP call.',
        'Application layer coordinates the use case.',
        'Domain entities represent business data.',
        'Infrastructure layer handles repository/persistence concerns.',
        'MySQL stores property and owner records.'
      ],
      scaling: [
        'New endpoints can follow the existing layered structure.',
        'Domain model can expand with more real estate rules.',
        'Persistence can evolve with migrations and richer relationships.',
        'Tests project can grow as business rules become more complex.'
      ],
      stack: ['C#', 'ASP.NET Core', 'Entity Framework Core', 'MySQL', 'Swagger', 'REST API', 'Backend', 'Layered Architecture']
    }
  }
];
