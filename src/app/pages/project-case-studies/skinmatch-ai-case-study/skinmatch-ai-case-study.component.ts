import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface CaseStudyCard {
  readonly title: string;
  readonly items: readonly string[];
}

interface FlowStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-skinmatch-ai-case-study',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './skinmatch-ai-case-study.component.html',
  styleUrl: './skinmatch-ai-case-study.component.scss'
})
export class SkinmatchAiCaseStudyComponent {
  readonly tags = ['Full Stack', 'AI', 'Python', 'TypeScript', 'Product Thinking', 'Recommendation Flow'];
  readonly repositoryUrl = 'https://github.com/juliapinheiro42/SkinMatch-AI';

  readonly userFlow: readonly FlowStep[] = [
    {
      number: '01',
      title: 'Skin Profile',
      description: 'User informs skin type and general characteristics.'
    },
    {
      number: '02',
      title: 'Concerns',
      description: 'User selects concerns such as acne, oiliness, dryness, dark spots or sensitivity.'
    },
    {
      number: '03',
      title: 'Preferences & Restrictions',
      description: 'User adds preferences, restrictions or ingredients they want to avoid.'
    },
    {
      number: '04',
      title: 'Processing',
      description: 'The backend/recommendation layer analyzes the user context.'
    },
    {
      number: '05',
      title: 'AI-Assisted Response',
      description: 'The system returns a recommendation or analysis with an explanation.'
    }
  ];

  readonly architectureFlow = [
    'Frontend',
    'API / Backend',
    'Recommendation Logic',
    'Product & Ingredient Data',
    'AI-Assisted Response'
  ];

  readonly technicalCards: readonly CaseStudyCard[] = [
    {
      title: 'Frontend',
      items: ['TypeScript interface', 'Guided user experience', 'Responsive layout', 'Product-oriented flow']
    },
    {
      title: 'Backend',
      items: ['Python backend structure', 'Input processing', 'Recommendation logic foundation', 'API-ready architecture']
    },
    {
      title: 'AI / Recommendation Logic',
      items: ['User context analysis', 'Product matching concept', 'Explainable suggestions', 'Decision-support approach']
    },
    {
      title: 'Future Infrastructure',
      items: ['Database integration', 'Authentication', 'User history', 'Automated tests', 'API documentation', 'Deployment pipeline']
    }
  ];

  readonly features = [
    'Guided skincare profile',
    'Skin concern mapping',
    'AI-assisted product analysis',
    'Personalized recommendation flow',
    'Explainable suggestions',
    'Product discovery support',
    'Future ingredient compatibility analysis'
  ];

  readonly challenges = [
    'Avoiding medical claims',
    'Handling subjective skin data',
    'Making recommendations explainable',
    'Structuring product and ingredient information',
    'Balancing AI output with safety and clarity'
  ];

  readonly learnings = [
    'AI should support decisions, not replace critical thinking',
    'Product thinking matters as much as interface design',
    'UX is essential in intelligent systems',
    'Recommendation systems need explainability',
    'Sensitive domains require careful wording and responsibility',
    'Separating frontend, backend and logic makes the project easier to evolve'
  ];

  readonly futureImprovements = [
    'Add real skincare product database',
    'Map ingredients and active components',
    'Create compatibility score',
    'Add user authentication',
    'Save user history',
    'Add automated tests',
    'Document the API',
    'Deploy the project',
    'Add filters by price, brand, country and restrictions',
    'Improve recommendation explainability'
  ];
}
