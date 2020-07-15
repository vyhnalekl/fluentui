import { implementsShorthandProp, isConformant } from 'test/specs/commonTests';

import { Box } from 'src/components/Box/Box';
import { ToolbarMenu } from 'src/components/Toolbar/ToolbarMenu';
import { ToolbarMenuItem } from 'src/components/Toolbar/ToolbarMenuItem';

describe('ToolbarMenuItem', () => {
  isConformant(ToolbarMenuItem, {
    wrapperComponent: Box,
    autoControlledProps: ['menuOpen'],
    constructorName: 'ToolbarMenuItem',
  });
  implementsShorthandProp(ToolbarMenuItem)('menu', ToolbarMenu, {
    implementsPopper: true,
    requiredProps: { menuOpen: true },
  });
});
