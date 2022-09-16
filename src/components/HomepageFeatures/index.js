import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/easy2use.svg').default,
    description: (
      <>
        Easy to create a DAG view in <a href="./docs/tutorial-react/read-only-dag">few steps</a> with this library.
      </>
    ),
  },
  {
    title: 'Easy to customize',
    Svg: require('@site/static/img/easy2customize.svg').default,
    description: (
      <>
        Easy to customize your DAG render with <a href="./docs/api-ref/useNiceDag">simple APIs</a>.
      </>
    ),
  },
  {
    title: 'Framework Agnostic',
    Svg: require('@site/static/img/frameworkAgnostic.svg').default,
    description: (
      <>
        It can be used by different front-end frameworks like Angular, React, Vue.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
