import * as React from 'react';
import * as _ from 'lodash';

import ComponentExampleTitle from '../ComponentExample/ComponentExampleTitle';

import { Accordion, Flex, Segment, Menu, Loader } from '@fluentui/react-northstar';

import PrototypeExampleControls from './PrototypePerfControls';

const PerfChart = React.lazy(async () => ({
  default: (await import(/* webpackChunkName: "component-chart" */ './PrototypePerfChart')).PrototypePerfChart,
}));
const ResourcesChart = React.lazy(async () => ({
  default: (await import(/* webpackChunkName: "component-chart" */ './PrototypeResourcesChart'))
    .PrototypeResourcesChart,
}));

export interface PrototypePerfExampleProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  examplePath: string;
}

const PrototypePerfExample: React.FC<PrototypePerfExampleProps> = props => {
  const { title, description, examplePath } = props;
  const Prototype = React.lazy(async () => ({
    default: (await import(/* webpackChunkName: "prototype-example" */ `../../../examples/${examplePath}`)).default,
  }));
  const [currentChart, setCurrentChart] = React.useState<'perf' | 'resources'>('perf');

  const perfTestName = `${_.camelCase(_.last(examplePath.split('/')))}Tsx`;

  return (
    <>
      <Segment variables={{ padding: 0 }}>
        <Segment variables={{ boxShadowColor: undefined }}>
          <Flex space="between" style={{ padding: '10px 20px' }}>
            <ComponentExampleTitle title={title} description={description} />
            <Menu
              primary
              items={[
                {
                  content: 'Performance',
                  key: 'performance',
                  active: currentChart === 'perf',
                  onClick: () => setCurrentChart('perf'),
                },
                {
                  content: 'Resources',
                  key: 'resources',
                  active: currentChart === 'resources',
                  onClick: () => setCurrentChart('resources'),
                },
              ]}
            />
          </Flex>
          <React.Suspense fallback={<Loader />}>
            {currentChart === 'perf' ? (
              <PerfChart perfTestName={perfTestName} />
            ) : (
              <ResourcesChart perfTestName={perfTestName} />
            )}
          </React.Suspense>
        </Segment>
        <Accordion
          panels={
            [
              {
                title: {
                  key: 't',
                  content: 'Show prototype',
                  styles: ({ theme }) => {
                    return {
                      fontSize: theme.siteVariables.fontSizes.smaller,
                    };
                  },
                },
                content: (
                  <Flex column>
                    <Flex padding="padding.medium" fill hAlign="end">
                      <PrototypeExampleControls examplePath={examplePath} />
                    </Flex>
                    <Prototype />
                  </Flex>
                ),
              },
            ] as any[]
          }
        />
      </Segment>
    </>
  );
};

export default PrototypePerfExample;
