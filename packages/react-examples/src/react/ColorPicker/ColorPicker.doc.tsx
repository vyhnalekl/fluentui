import * as React from 'react';
import { ColorPickerBasicExample } from './ColorPicker.Basic.Example';

import { IDocPageProps } from '@fluentui/react-internal/lib/common/DocPage.types';

const ColorPickerBasicExampleCode = require('!raw-loader!@fluentui/react-examples/src/react/ColorPicker/ColorPicker.Basic.Example.tsx') as string;
export const ColorPickerPageProps: IDocPageProps = {
  title: 'ColorPicker',
  componentName: 'ColorPicker',
  componentUrl: 'https://github.com/microsoft/fluentui/tree/master/packages/react-internal/src/components/ColorPicker',
  examples: [
    {
      title: 'Default ColorPicker',
      code: ColorPickerBasicExampleCode,
      view: <ColorPickerBasicExample />,
    },
  ],
  overview: require<string>('!raw-loader!@fluentui/react-examples/src/react/ColorPicker/docs/ColorPickerOverview.md'),
  bestPractices: require<
    string
  >('!raw-loader!@fluentui/react-examples/src/react/ColorPicker/docs/ColorPickerBestPractices.md'),
  isHeaderVisible: true,
  isFeedbackVisible: true,
};
