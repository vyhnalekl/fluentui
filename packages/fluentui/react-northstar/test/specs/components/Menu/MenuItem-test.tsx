import * as React from 'react';

import { Accessibility, menuItemAsToolbarButtonBehavior, tabBehavior } from '@fluentui/accessibility';
import { isConformant as newIsConformant } from '@fluentui/react-conformance';
import {
  isConformant,
  handlesAccessibility,
  getRenderedAttribute,
  implementsShorthandProp,
} from 'test/specs/commonTests';
import { mountWithProviderAndGetComponent, mountWithProvider as mount } from 'test/utils';
import { MenuItem } from 'src/components/Menu/MenuItem';
import { Menu } from 'src/components/Menu/Menu';
import { MenuItemWrapper, menuItemWrapperClassName } from 'src/components/Menu/MenuItemWrapper';

describe('MenuItem', () => {
  isConformant(MenuItem, {
    constructorName: 'MenuItem',
    eventTargets: {
      onClick: `.${menuItemWrapperClassName}`,
    },
    wrapperComponent: MenuItemWrapper,
    autoControlledProps: ['menuOpen'],
  });

  newIsConformant({
    Component: MenuItem,
    displayName: 'MenuItem',
    customMount: mount,
    componentPath: __filename.replace(/test[/\\]specs/, 'src').replace('-test.tsx', '.tsx'),
    wrapperComponent: MenuItemWrapper,
    disabledTests: ['has-top-level-file'],
  });

  implementsShorthandProp(MenuItem)('menu', Menu, {
    implementsPopper: true,
    requiredProps: { active: true, menuOpen: true },
  });

  it('content renders as `li > a`', () => {
    const menuItem = mountWithProviderAndGetComponent(MenuItem, <MenuItem content="Home" />)
      .find(`.${menuItemWrapperClassName}`)
      .hostNodes();

    expect(menuItem.is('li')).toBe(true);
    // The ElementType is wrapped with Ref, which is adding two HOC in total, that's why we need the three childAt(0) usages
    expect(
      menuItem
        .childAt(0)
        .childAt(0)
        .childAt(0)
        .is('a'),
    ).toBe(true);
    expect(menuItem.text()).toBe('Home');
  });

  it('children render directly inside `li`', () => {
    const menuItem = mountWithProviderAndGetComponent(MenuItem, <MenuItem>Home</MenuItem>)
      .find(`.${menuItemWrapperClassName}`)
      .hostNodes();

    expect(menuItem.is('li')).toBe(true);
    expect(
      menuItem
        .childAt(0)
        .hostNodes()
        .exists(),
    ).toBe(false);
    expect(menuItem.text()).toBe('Home');
  });

  describe('accessibility', () => {
    handlesAccessibility(MenuItem, { defaultRootRole: 'presentation', usesWrapperSlot: true });
    handlesAccessibility(MenuItem, { defaultRootRole: 'menuitem', partSelector: 'a' });
    const behaviors: { name: string; behavior: Accessibility; expectedAnchorRole: string }[] = [
      { name: 'default', behavior: undefined, expectedAnchorRole: 'menuitem' },
      {
        name: 'menuItemAsToolbarButtonBehavior',
        behavior: menuItemAsToolbarButtonBehavior,
        expectedAnchorRole: 'button',
      },
      { name: 'tabBehavior', behavior: tabBehavior, expectedAnchorRole: 'tab' },
    ];
    behaviors.forEach(accessibility => {
      test(`integration test for ${accessibility.name} behavior`, () => {
        // accessibility functionality is covered by a combination of behavior tests and `handlesAccessibility()`
        // this is just an integration smoke test
        const ariaLabel = 'Useful Tool Tip';
        const menuItemComponent = mountWithProviderAndGetComponent(
          MenuItem,
          <MenuItem disabled aria-label={ariaLabel} accessibility={accessibility.behavior} />,
        );
        expect(getRenderedAttribute(menuItemComponent, 'role', '')).toBe('presentation');
        expect(getRenderedAttribute(menuItemComponent, 'aria-disabled', '')).toBe(undefined);
        expect(getRenderedAttribute(menuItemComponent, 'aria-label', '')).toBe(undefined);
        expect(getRenderedAttribute(menuItemComponent, 'role', 'a')).toBe(accessibility.expectedAnchorRole);
        expect(getRenderedAttribute(menuItemComponent, 'aria-disabled', 'a')).toBe('true');
        expect(getRenderedAttribute(menuItemComponent, 'aria-label', 'a')).toBe(ariaLabel);
      });
    });
  });
});
