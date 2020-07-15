import * as React from 'react';
import { IPageSectionProps, Markdown } from '@uifabric/example-app-base/lib/index2';
import { ControlsAreaPage, IControlsPageProps } from '../ControlsAreaPage';
import { LinkPageProps } from './LinkPage.doc';
import { Platforms } from '../../../interfaces/Platforms';
import { ImplementationSection } from '@uifabric/example-app-base/lib/index2';
import { ApiKind } from 'office-ui-fabric-react/lib/common/DocPage.types';

/* eslint-disable @fluentui/max-len */

const baseUrl = 'https://github.com/microsoft/fluentui/tree/master/apps/fabric-website/src/pages/Controls/LinkPage';

export const LinkPage: React.FunctionComponent<IControlsPageProps> = props => {
  const { platform } = props;
  return (
    <ControlsAreaPage
      {...props}
      {...LinkPageProps[platform]}
      otherSections={_otherSections(platform) as IPageSectionProps[]}
    />
  );
};

function _otherSections(platform: Platforms): IPageSectionProps<Platforms>[] {
  switch (platform) {
    case 'mac':
      return [
        {
          sectionName: 'Implementation',
          editUrl: baseUrl + 'docs/mac/LinkImplementation.md',
          content: require('!raw-loader!@uifabric/fabric-website/src/pages/Controls/LinkPage/docs/mac/LinkImplementation.md') as string,
        },
      ];
    case 'cross':
      return [
        {
          sectionName: 'Implementation',
          editUrl: baseUrl + 'docs/cross/LinkImplementation.md',
          content: (
            <ImplementationSection
              jsonDocs={{
                name: '',
                tables: [
                  {
                    kind: 'interface' as ApiKind,
                    name: 'ILinkProps',
                    description: '\n',
                    extendsTokens: [],
                    members: [
                      {
                        name: 'componentRef',
                        typeTokens: [
                          {
                            text: 'React.RefObject<IFocusable>',
                          },
                        ],
                        kind: 'property' as 'property',
                        description:
                          'A RefObject to access the IButton interface. Use this to access the public methods and properties of the component.\n',
                        deprecated: false,
                      },
                      {
                        name: 'content',
                        typeTokens: [
                          {
                            text: 'string',
                          },
                        ],
                        kind: 'property' as 'property',
                        description: 'The visible text of the link that the user sees.\n',
                        deprecated: false,
                      },
                      {
                        name: 'url',
                        typeTokens: [
                          {
                            text: 'string',
                          },
                        ],
                        kind: 'property' as 'property',
                        description:
                          'The URL that is opened when the link is clicked.  This value supersedes the onPress callback when both are present.\n',
                        deprecated: false,
                      },
                    ],
                  },
                ],
              }}
            />
          ),
        },
      ];
  }
}
