export type BugStatus = 'Buried' | 'Contained' | 'Escaped';
export type BugSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface BugGraveyardItem {
  readonly id: string;
  readonly title: string;
  readonly status: BugStatus;
  readonly category: string;
  readonly severity: BugSeverity;
  readonly context: string;
  readonly error: string;
  readonly fix: string;
  readonly lesson: string;
  readonly skills: readonly string[];
}

export const BUG_GRAVEYARD: readonly BugGraveyardItem[] = [
  {
    id: 'bug-001',
    title: 'RabbitMQ CreateModel() deprecated',
    status: 'Buried',
    category: 'Messaging',
    severity: 'High',
    context: 'RabbitMQ.Client 7.x changed the old IModel/CreateModel pattern to the newer async IChannel API.',
    error: 'IConnection does not contain a definition for CreateModel.',
    fix: 'Migrated the event bus code to CreateChannelAsync, IChannel, ExchangeDeclareAsync, QueueDeclareAsync and BasicPublishAsync.',
    lesson: 'Upgrading infrastructure libraries can affect architecture, dependency injection and async flow.',
    skills: ['RabbitMQ', '.NET', 'Async APIs', 'Event-driven architecture']
  },
  {
    id: 'bug-002',
    title: 'Swagger schemaId conflict',
    status: 'Buried',
    category: 'API Documentation',
    severity: 'Medium',
    context: 'Two request DTOs with the same nested class name caused Swashbuckle to fail schema generation.',
    error: 'The same schemaId is already used.',
    fix: 'Renamed DTOs or configured custom schema IDs to avoid name collisions.',
    lesson: 'API documentation tools need clear model naming, especially in larger applications.',
    skills: ['Swagger', 'Swashbuckle', 'ASP.NET Core', 'API Design']
  },
  {
    id: 'bug-003',
    title: 'Keycloak invalid URI',
    status: 'Buried',
    category: 'Authentication',
    severity: 'High',
    context: 'JWT/OpenID configuration failed because the authority URL was malformed.',
    error: 'Invalid URI: The format of the URI could not be determined.',
    fix: 'Validated Keycloak configuration and built the Authority URL correctly using AuthServerUrl and Realm.',
    lesson: 'Authentication bugs are often configuration bugs disguised as runtime errors.',
    skills: ['Keycloak', 'JWT', 'ASP.NET Core Authentication', 'Configuration']
  },
  {
    id: 'bug-004',
    title: 'EF Core JSON converter expression tree error',
    status: 'Buried',
    category: 'Persistence',
    severity: 'Medium',
    context: 'Tried to persist list properties using JSON conversion in EF Core.',
    error: 'An expression tree may not contain a call or invocation that uses optional arguments.',
    fix: 'Adjusted the JSON serialization calls to avoid optional arguments inside expression tree mappings.',
    lesson: 'ORM mapping expressions have limitations that normal C# code does not always have.',
    skills: ['EF Core', 'Value Converters', 'JSON Serialization', 'C#']
  },
  {
    id: 'bug-005',
    title: 'Docker network and auth issues',
    status: 'Buried',
    category: 'Infrastructure',
    severity: 'High',
    context: 'Services needed to communicate with MySQL and RabbitMQ containers using Docker Compose.',
    error: 'No such host is known / ACCESS_REFUSED login was refused.',
    fix: 'Checked container service names, ports, environment variables, credentials and broker logs.',
    lesson: 'Containerized systems require precise networking, credentials and startup ordering.',
    skills: ['Docker', 'Docker Compose', 'RabbitMQ', 'MySQL', 'Infrastructure Debugging']
  },
  {
    id: 'bug-006',
    title: 'TypeScript modal props mismatch',
    status: 'Buried',
    category: 'Frontend',
    severity: 'Medium',
    context: 'Reusable React modals had inconsistent props for create, edit, view and status-change flows.',
    error: "Property 'mode' is missing / Property does not exist on type.",
    fix: 'Aligned component prop interfaces, separated modal responsibilities and made state handling explicit.',
    lesson: 'Strong typing catches UI architecture problems before runtime.',
    skills: ['TypeScript', 'React', 'Component Design', 'Frontend Architecture']
  },
  {
    id: 'bug-007',
    title: 'Dependency Injection unresolved service',
    status: 'Buried',
    category: 'Backend Architecture',
    severity: 'High',
    context: 'Command handlers depended on repository interfaces that were not registered in the DI container.',
    error: 'Unable to resolve service for type IRepository while attempting to activate CommandHandler.',
    fix: 'Registered repository interfaces and implementations in the infrastructure dependency injection layer.',
    lesson: 'Clean Architecture depends on explicit boundaries and correct dependency registration.',
    skills: ['ASP.NET Core DI', 'MediatR', 'Clean Architecture', 'Repository Pattern']
  }
];
