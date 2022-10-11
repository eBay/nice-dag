export const ComplexFlattenModel = [
    {
        id: 'start',
    },
    {
        id: 'parent',
        dependencies: ['start'],
        data: {
            label: 'Parent',
        },
    },
    {
        id: 'child-1',
        data: {
            label: 'Child-1',
        },
        parentId: 'parent'
    },
    {
        id: 'child-2',
        dependencies: ['child-1'],
        data: {
            label: 'Child-2',
        },
        parentId: 'parent'
    },
    {
        id: 'child-1-1',
        data: {
            label: 'Child-1-1',
        },
        parentId: 'child-1'
    },
    {
        id: 'end',
        dependencies: ['parent'],
    },
];