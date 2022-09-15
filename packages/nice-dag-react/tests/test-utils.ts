export const mapNodeSize = (node) => {
  return {
    width: 10,
    height: 10,
  };
};

export const initNodes = [
  {
    id: "start",
  },
  {
    id: "1",
    dependencies: ["start"],
    children: [
      {
        id: "1.s",
      },
      {
        id: "1.1",
        dependencies: ["1.s"],
      },
      {
        id: "1.2",
        dependencies: ["1.1"],
      },
      {
        id: "1.e",
        dependencies: ["1.2"],
      },
    ],
  },
  {
    id: "2",
    dependencies: ["start"],
  },
  {
    id: "3",
    dependencies: ["2"],
    children: [
      {
        id: "3.s",
      },
      {
        id: "3.1",
        dependencies: ["3.s"],
      },
      {
        id: "3.e",
        dependencies: ["3.1"],
        children: [
          {
            id: "3.e.s",
          },
          {
            id: "3.e.1",
            dependencies: ["3.e.s"],
            children: [
              {
                id: "3.e.1.s",
              },
              {
                id: "3.e.1.e",
                dependencies: ["3.e.1.s"],
                children: [
                  {
                    id: "3.e.1.e.s",
                  },
                  {
                    id: "3.e.1.e.2",
                    children: [
                      {
                        id: "3.e.1.e.2.s",
                      },
                      {
                        id: "3.e.1.e.2.e",
                        dependencies: ["3.e.1.e.2.s"],
                      },
                    ],
                  },
                  {
                    id: "3.e.1.e.e",
                    dependencies: ["3.e.1.e.2"],
                  },
                ],
              },
            ],
          },
          {
            id: "3.e.e",
            dependencies: ["3.e.1"],
          },
        ],
      },
    ],
  },
  {
    id: "end",
    dependencies: ["1", "3"],
  },
];
