---
sidebar_position: 1
---

# Contribution

## Setup Dev Environment

Nice-DAG is a mono-repo project. It uses **_PNPM_** to manage the node modules. To setup the development environment, the PNPM should be installed before getting started.

Once you check out the code base, you can simply run the following commands at the project root folder.

```
pnpm install
pnpm build
```

After then, you can run **_pnpm build_** separately for the module folders of **_packages_** when you changes code correspondingly.

### Run Exapmle

The example project is a react project. To see the example, you can simply run the following command.

```
cd example
pnpm start
```

After then, you can explore **_http://localhost:3100/home_** to see the sample.

### How to Debug

The mono-repo can link the **nice-dag-core** and **nice-dag-react** to the example project.If you want to make change, you need to run command `pnpm build` separatedly. After then, you can simply refresh the sample page to debug.
