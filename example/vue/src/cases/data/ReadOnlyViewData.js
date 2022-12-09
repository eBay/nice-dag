export const HierarchicalModel = [
  {
    id: 'start',
  },
  {
    id: 'git-clone',
    dependencies: ['start'],
    data: {
      label: 'Git Clone',
    },
  },
  {
    id: 'mvn',
    dependencies: ['git-clone'],
    data: {
      label: 'Mvn Install',
    },
  },
  {
    id: 'security-check',
    dependencies: ['git-clone'],
    data: {
      label: 'Security Check',
    },
  },
  {
    id: 'build',
    dependencies: ['mvn', 'security-check'],
    data: {
      label: 'Build',
    },
  },
  {
    id: 'deploy-fp-1',
    dependencies: ['build'],
    data: {
      label: 'Deploy Feature-1',
    },
    children: [
      {
        id: 'provision-fp-1',
        data: {
          label: 'Provision Pool',
        },
      },
      {
        id: 'deployment-fp-1',
        dependencies: ['provision-fp-1'],
        data: {
          label: 'Deployment',
        },
      },
    ],
  },
  {
    id: 'deploy-fp-2',
    dependencies: ['build'],
    data: {
      label: 'Deploy Feature-2',
    },
    children: [
      {
        id: 'provision-fp-2',
        data: {
          label: 'Provision Pool',
        },
      },
      {
        id: 'deployment-fp-2',
        dependencies: ['provision-fp-2'],
        data: {
          label: 'Deployment',
        },
      },
    ],
  },
  {
    id: 'smoke-test',
    dependencies: ['deploy-fp-1', 'deploy-fp-2'],
  },
  {
    id: 'integration-test',
    dependencies: ['smoke-test'],
  },
  {
    id: 'prod-deployment',
    dependencies: ['integration-test'],
  },
  {
    id: 'end',
    dependencies: ['prod-deployment'],
  },
];

export const FlattenModel = [
  {
    id: 'start',
  },
  {
    id: 'git-clone',
    dependencies: ['start'],
    data: {
      label: 'Git Clone',
    },
  },
  {
    id: 'mvn',
    dependencies: ['git-clone'],
    data: {
      label: 'Mvn Install',
    },
  },
  {
    id: 'security-check',
    dependencies: ['git-clone'],
    data: {
      label: 'Security Check',
    },
  },
  {
    id: 'build',
    dependencies: ['mvn', 'security-check'],
    data: {
      label: 'Build',
    },
  },
  {
    id: 'deploy-fp-1',
    dependencies: ['build'],
    data: {
      label: 'Deploy Feature-1',
    },
  },
  {
    id: 'provision-fp-1',
    data: {
      label: 'Provision Pool',
    },
    parentId: 'deploy-fp-1'
  },
  {
    id: 'deployment-fp-1',
    dependencies: ['provision-fp-1'],
    data: {
      label: 'Deployment',
    },
    parentId: 'deploy-fp-1'
  },
  {
    id: 'deploy-fp-2',
    dependencies: ['build'],
    data: {
      label: 'Deploy Feature-2',
    },
  },
  {
    id: 'provision-fp-2',
    data: {
      label: 'Provision Pool',
    },
    parentId: 'deploy-fp-2'
  },
  {
    id: 'deployment-fp-2',
    dependencies: ['provision-fp-2'],
    data: {
      label: 'Deployment',
    },
    parentId: 'deploy-fp-2'
  },
  {
    id: 'deployment-fp-3',
    dependencies: ['deployment-fp-2'],
    data: {
      label: 'Last Step',
    },
    parentId: 'deploy-fp-2'

  },
  {
    id: 'deployment-fp-2-2',
    data: {
      label: 'Deployment-child',
    },
    parentId: 'deployment-fp-2'
  },
  {
    id: 'deployment-fp-2-2-child',
    data: {
      label: 'Deployment-child-child',
    },
    parentId: 'deployment-fp-2-2'
  },
  {
    id: 'smoke-test',
    dependencies: ['deploy-fp-1', 'deploy-fp-2'],
  },
  {
    id: 'integration-test',
    dependencies: ['smoke-test'],
  },
  {
    id: 'prod-deployment',
    dependencies: ['integration-test'],
  },
  {
    id: 'end',
    dependencies: ['prod-deployment'],
  },
];