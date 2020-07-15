import { Accessibility, submenuBehavior, menuItemBehavior, MenuItemBehaviorProps } from '@fluentui/accessibility';
import {
  compose,
  focusAsync,
  mergeVariablesOverrides,
  useTelemetry,
  useAutoControlled,
  useFluentContext,
  getElementType,
  useUnhandledProps,
  useAccessibility,
  useStyles,
  ComponentWithAs,
  ShorthandConfig,
} from '@fluentui/react-bindings';
import { EventListener } from '@fluentui/react-component-event-listener';
import { Ref, handleRef } from '@fluentui/react-component-ref';
import * as customPropTypes from '@fluentui/react-proptypes';
import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import {
  childrenExist,
  createShorthand,
  doesNodeContainClick,
  UIComponentProps,
  ChildrenComponentProps,
  ContentComponentProps,
  commonPropTypes,
  isFromKeyboard as isEventFromKeyboard,
} from '../../utils';
import { Menu, MenuProps, MenuShorthandKinds } from './Menu';
import { MenuItemIcon, MenuItemIconProps } from './MenuItemIcon';
import { MenuItemContent, MenuItemContentProps } from './MenuItemContent';
import { MenuItemIndicator, MenuItemIndicatorProps } from './MenuItemIndicator';
import { MenuItemWrapper, MenuItemWrapperProps } from './MenuItemWrapper';
import { ComponentEventHandler, ShorthandValue, ShorthandCollection } from '../../types';
import { Popper, PopperShorthandProps, getPopperPropsFromShorthand } from '../../utils/positioner';

import { MenuContext, MenuItemSubscribedValue } from './menuContext';
import { useContextSelectors } from '@fluentui/react-context-selector';

export interface MenuItemSlotClassNames {
  submenu: string;
}

export interface MenuItemProps
  extends UIComponentProps,
    ChildrenComponentProps,
    ContentComponentProps<ShorthandValue<MenuItemContentProps>> {
  /**
   * Accessibility behavior if overridden by the user.
   * @available menuItemAsToolbarButtonBehavior, tabBehavior
   */
  accessibility?: Accessibility<MenuItemBehaviorProps>;

  /** A menu item can be active. */
  active?: boolean;

  /** A menu item can show it is currently unable to be interacted with. */
  disabled?: boolean;

  /** Name or shorthand for Menu Item Icon */
  icon?: ShorthandValue<MenuItemIconProps>;

  /** A menu may have just icons. */
  iconOnly?: boolean;

  /** MenuItem index inside Menu. */
  index?: number;

  /** MenuItem position inside Menu (skipping separators). */
  itemPosition?: number;

  /** MenuItem count inside Menu. */
  itemsCount?: number;

  /**
   * Called on click.
   *
   * @param event - React's original SyntheticEvent.
   * @param data - All props.
   */
  onClick?: ComponentEventHandler<MenuItemProps>;

  /**
   * Called after user's focus.
   * @param event - React's original SyntheticEvent.
   * @param data - All props.
   */
  onFocus?: ComponentEventHandler<MenuItemProps>;

  /**
   * Called after item blur.
   * @param event - React's original SyntheticEvent.
   * @param data - All props.
   */
  onBlur?: ComponentEventHandler<MenuItemProps>;

  /** A menu can adjust its appearance to de-emphasize its contents. */
  pills?: boolean;

  /**
   * A menu can point to show its relationship to nearby content.
   * For vertical menu, it can point to the start of the item or to the end.
   */
  pointing?: boolean | 'start' | 'end';

  /** The menu item can have primary type. */
  primary?: boolean;

  /** The menu item can have secondary type. */
  secondary?: boolean;

  /** Menu items can by highlighted using underline. */
  underlined?: boolean;

  /** A vertical menu displays elements vertically. */
  vertical?: boolean;

  /** Shorthand for the wrapper component. */
  wrapper?: ShorthandValue<MenuItemWrapperProps>;

  /** Shorthand for the submenu. */
  menu?:
    | ShorthandValue<MenuProps & { popper?: PopperShorthandProps }>
    | ShorthandCollection<MenuItemProps, MenuShorthandKinds>;

  /** Indicates if the menu inside the item is open. */
  menuOpen?: boolean;

  /** Default menu open */
  defaultMenuOpen?: boolean;

  /** Callback for setting the current menu item as active element in the menu. */
  onActiveChanged?: ComponentEventHandler<MenuItemProps>;

  /** Indicates whether the menu item is part of submenu. */
  inSubmenu?: boolean;

  /** Shorthand for the submenu indicator. */
  indicator?: ShorthandValue<MenuItemIndicatorProps>;

  /**
   * Event for request to change 'open' value.
   * @param event - React's original SyntheticEvent.
   * @param data - All props and proposed value.
   */
  onMenuOpenChange?: ComponentEventHandler<MenuItemProps>;
}

export type MenuItemStylesProps = Required<
  Pick<
    MenuItemProps,
    | 'primary'
    | 'underlined'
    | 'active'
    | 'vertical'
    | 'pointing'
    | 'secondary'
    | 'disabled'
    | 'iconOnly'
    | 'pills'
    | 'inSubmenu'
  >
> & { isFromKeyboard: boolean };

export type MenuItemState = { isFromKeyboard: boolean; menuOpen: boolean };

export const menuItemClassName = 'ui-menu__item';
export const menuItemSlotClassNames: MenuItemSlotClassNames = {
  submenu: `${menuItemClassName}__submenu`,
};

/**
 * A MenuItem is an actionable item within a Menu.
 */
export const MenuItem = compose<'a', MenuItemProps, MenuItemStylesProps, {}, {}>(
  (inputProps, ref, composeOptions) => {
    const context = useFluentContext();
    const { setStart, setEnd } = useTelemetry(composeOptions.displayName, context.telemetry);
    setStart();

    const parentProps = (useContextSelectors(MenuContext, {
      active: v => v.activeIndex === inputProps.index,
      onItemClick: v => v.onItemClick,
      variables: v => v.variables,
      menuSlot: v => v.slots.menu,
      slotProps: v => v.slotProps.item,
      accessibility: v => v.behaviors.item,
    }) as unknown) as MenuItemSubscribedValue; // TODO: we should improve typings for the useContextSelectors

    const props = {
      ...parentProps.slotProps,
      active: parentProps.active,
      variables: parentProps.variables,
      accessibility: parentProps.accessibility,
      ...inputProps,
    };

    const {
      accessibility = menuItemBehavior,
      children,
      content,
      icon,
      wrapper,
      menu,
      primary,
      secondary,
      active,
      vertical,
      indicator,
      disabled,
      underlined,
      iconOnly,
      inSubmenu,
      pills,
      pointing,
      className,
      design,
      styles,
      variables,
    } = props;

    const [menuOpen, setMenuOpen] = useAutoControlled({
      defaultValue: props.defaultMenuOpen,
      value: props.menuOpen,
      initialValue: false,
    });

    const [isFromKeyboard, setIsFromKeyboard] = React.useState(false);

    const ElementType = getElementType(props);
    const unhandledProps = useUnhandledProps(composeOptions.handledProps, props);

    const slotProps = composeOptions.resolveSlotProps<MenuItemProps & MenuItemState>({
      ...props,
      accessibility,
      variables: mergeVariablesOverrides(variables, parentProps.variables),
      isFromKeyboard,
      menuOpen,
    });

    const getA11yProps = useAccessibility<MenuItemBehaviorProps>(accessibility, {
      debugName: composeOptions.displayName,
      actionHandlers: {
        performClick: event => !event.defaultPrevented && handleClick(event),
        openMenu: event => openMenu(event),
        closeAllMenusAndFocusNextParentItem: event => closeAllMenus(event),
        closeMenu: event => closeMenu(event),
        closeMenuAndFocusTrigger: event => closeMenu(event, true),
        doNotNavigateNextParentItem: event => {
          event.stopPropagation();
        },
        closeAllMenus: event => closeAllMenus(event),
      },
      mapPropsToBehavior: () => ({
        menuOpen,
        hasMenu: !!menu,
        disabled,
        vertical,
      }),
      rtl: context.rtl,
    });

    const { classes, styles: resolvedStyles } = useStyles<MenuItemStylesProps>(MenuItem.displayName, {
      className: composeOptions.className,
      mapPropsToStyles: () => ({
        primary,
        underlined,
        active,
        vertical,
        pointing,
        secondary,
        disabled,
        iconOnly,
        pills,
        inSubmenu,
        isFromKeyboard,
      }),
      mapPropsToInlineStyles: () => ({
        className,
        design,
        styles,
        variables: mergeVariablesOverrides(parentProps.variables, variables),
      }),
      rtl: context.rtl,
      composeOptions,
      unstable_props: { ...props, menuOpen, isFromKeyboard },
    });

    const menuRef = React.useRef<HTMLElement>();
    const itemRef = React.useRef<HTMLElement>();

    const handleWrapperBlur = (e: React.FocusEvent) => {
      if (!props.inSubmenu && !e.currentTarget.contains(e.relatedTarget as Node)) {
        trySetMenuOpen(false, e);
      }
    };

    const outsideClickHandler = (e: MouseEvent) => {
      if (!isSubmenuOpen()) return;
      if (
        !doesNodeContainClick(itemRef.current, e, context.target) &&
        !doesNodeContainClick(menuRef.current, e, context.target)
      ) {
        trySetMenuOpen(false, e);
      }
    };

    const performClick = (e: React.MouseEvent | React.KeyboardEvent) => {
      if (menu) {
        if (doesNodeContainClick(menuRef.current, (e as unknown) as MouseEvent, context.target)) {
          // submenu was clicked => close it and propagate
          trySetMenuOpen(false, e, () => focusAsync(itemRef.current));
        } else {
          // the menuItem element was clicked => toggle the open/close and stop propagation
          trySetMenuOpen(active ? !menuOpen : true, e);
          e.stopPropagation();
          e.preventDefault();
        }
      }
    };

    const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      performClick(e);

      _.invoke({ onClick: parentProps.onItemClick, ...props }, 'onClick', e, props);
    };

    const handleBlur = (e: React.FocusEvent) => {
      setIsFromKeyboard(false);

      _.invoke(props, 'onBlur', e, props);
    };

    const handleFocus = (e: React.FocusEvent) => {
      setIsFromKeyboard(isEventFromKeyboard());

      _.invoke(props, 'onFocus', e, props);
    };

    const isSubmenuOpen = (): boolean => {
      return !!(menu && menuOpen);
    };

    const closeAllMenus = (e: React.MouseEvent | React.KeyboardEvent) => {
      if (!isSubmenuOpen()) {
        return;
      }

      trySetMenuOpen(false, e, () => {
        if (!inSubmenu) {
          focusAsync(itemRef.current);
        }
      });

      // avoid spacebar scrolling the page
      if (!inSubmenu) {
        e.preventDefault();
      }
    };

    const closeMenu = (e: React.MouseEvent | React.KeyboardEvent, forceTriggerFocus?: boolean) => {
      if (!isSubmenuOpen()) {
        return;
      }

      const shouldStopPropagation = inSubmenu || props.vertical;
      trySetMenuOpen(false, e, () => {
        if (forceTriggerFocus || shouldStopPropagation) {
          focusAsync(itemRef.current);
        }
      });

      if (forceTriggerFocus || shouldStopPropagation) {
        e.stopPropagation();
      }
    };

    const openMenu = (e: React.MouseEvent | React.KeyboardEvent) => {
      if (menu && !menuOpen) {
        trySetMenuOpen(true, e);
        _.invoke(props, 'onActiveChanged', e, { ...props, active: true });
        e.stopPropagation();
        e.preventDefault();
      }
    };

    const trySetMenuOpen = (
      newValue: boolean,
      e: MouseEvent | React.FocusEvent | React.KeyboardEvent | React.MouseEvent,
      onStateChanged?: any,
    ) => {
      setMenuOpen(newValue);
      // The reason why post-effect is not passed as callback to trySetState method
      // is that in 'controlled' mode the post-effect is applied before final re-rendering
      // which cause a broken behavior: for e.g. when it is needed to focus submenu trigger on ESC.
      // TODO: all DOM post-effects should be applied at componentDidMount & componentDidUpdated stages.
      onStateChanged && onStateChanged();
      _.invoke(props, 'onMenuOpenChange', e, {
        ...props,
        menuOpen: newValue,
      });
    };

    const menuItemInner = (
      <Ref
        innerRef={node => {
          itemRef.current = node;
          handleRef(ref, node);
        }}
      >
        <ElementType
          {...getA11yProps('root', {
            className: classes.root,
            disabled,
            onBlur: handleBlur,
            onFocus: handleFocus,
            ...unhandledProps,
          })}
          {...(!wrapper && { onClick: handleClick })}
        >
          {childrenExist(children) ? (
            children
          ) : (
            <>
              {createShorthand(composeOptions.slots.icon, icon, {
                defaultProps: () => getA11yProps('icon', slotProps.icon),
              })}
              {createShorthand(composeOptions.slots.content, content, {
                defaultProps: () => getA11yProps('content', slotProps.content),
              })}
              {menu &&
                createShorthand(composeOptions.slots.indicator, indicator, {
                  defaultProps: () => getA11yProps('indicator', slotProps.indicator),
                })}
            </>
          )}
        </ElementType>
      </Ref>
    );
    const maybeSubmenu =
      menu && active && menuOpen ? (
        <>
          <Ref innerRef={menuRef}>
            <Popper
              align={vertical ? 'top' : context.rtl ? 'end' : 'start'}
              position={vertical ? (context.rtl ? 'before' : 'after') : 'below'}
              targetRef={itemRef}
              {...getPopperPropsFromShorthand(menu)}
            >
              {createShorthand(parentProps.menuSlot || composeOptions.slots.menu || Menu, menu, {
                defaultProps: () => ({
                  ...slotProps.menu,
                  styles: resolvedStyles.menu,
                }),
              })}
            </Popper>
          </Ref>
          <EventListener listener={outsideClickHandler} target={context.target} type="click" />
        </>
      ) : null;

    if (wrapper) {
      const wrapperElement = createShorthand(composeOptions.slots.wrapper, wrapper, {
        defaultProps: () => getA11yProps('wrapper', slotProps.wrapper),
        overrideProps: () => ({
          children: (
            <>
              {menuItemInner}
              {maybeSubmenu}
            </>
          ),
          onClick: handleClick,
          onBlur: handleWrapperBlur,
        }),
      });

      setEnd();
      return wrapperElement;
    }

    setEnd();
    return menuItemInner;
  },
  {
    displayName: 'MenuItem',
    className: menuItemClassName,

    slots: {
      icon: MenuItemIcon,
      indicator: MenuItemIndicator,
      content: MenuItemContent,
      wrapper: MenuItemWrapper,
    },

    slotProps: (props: MenuItemProps & MenuItemState) => ({
      icon: {
        hasContent: !!props.content,
        iconOnly: props.iconOnly,
      },
      content: {
        hasIcon: !!props.icon,
        hasMenu: !!props.menu,
        inSubmenu: props.inSubmenu,
        vertical: props.vertical,
      },
      indicator: {
        iconOnly: props.iconOnly,
        vertical: props.vertical,
        inSubmenu: props.inSubmenu,
        active: props.active,
        primary: props.primary,
        underlined: props.underlined,
      },
      wrapper: {
        active: props.active,
        disabled: props.disabled,
        iconOnly: props.iconOnly,
        isFromKeyboard: props.isFromKeyboard,
        pills: props.pills,
        pointing: props.pointing,
        secondary: props.secondary,
        underlined: props.underlined,
        vertical: props.vertical,
        primary: props.primary,
      },
      menu: {
        accessibility: submenuBehavior,
        className: menuItemSlotClassNames.submenu,
        vertical: true,
        primary: props.primary,
        secondary: props.secondary,
        submenu: true,
        indicator: props.indicator,
      },
    }),

    handledProps: [
      'accessibility',
      'as',
      'children',
      'className',
      'content',
      'design',
      'active',
      'disabled',
      'icon',
      'iconOnly',
      'index',
      'itemPosition',
      'itemsCount',
      'onClick',
      'onFocus',
      'onBlur',
      'pills',
      'pointing',
      'primary',
      'secondary',
      'underlined',
      'vertical',
      'wrapper',
      'menu',
      'menuOpen',
      'defaultMenuOpen',
      'onActiveChanged',
      'inSubmenu',
      'indicator',
      'onMenuOpenChange',
      'styles',
      'variables',
    ],
    shorthandConfig: {
      mappedProp: 'content',
    },
  },
) as ComponentWithAs<'a', MenuItemProps> & {
  shorthandConfig: ShorthandConfig<MenuItemProps>;
};

MenuItem.propTypes = {
  ...commonPropTypes.createCommon({
    content: 'shorthand',
  }),
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: customPropTypes.shorthandAllowingChildren,
  iconOnly: PropTypes.bool,
  index: PropTypes.number,
  itemPosition: PropTypes.number,
  itemsCount: PropTypes.number,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  pills: PropTypes.bool,
  pointing: PropTypes.oneOf(['start', 'end', true, false]),
  primary: customPropTypes.every([customPropTypes.disallow(['secondary']), PropTypes.bool]),
  secondary: customPropTypes.every([customPropTypes.disallow(['primary']), PropTypes.bool]),
  underlined: PropTypes.bool,
  vertical: PropTypes.bool,
  wrapper: PropTypes.oneOfType([PropTypes.node, PropTypes.object]),
  menu: PropTypes.oneOfType([customPropTypes.itemShorthand, customPropTypes.collectionShorthand]),
  menuOpen: PropTypes.bool,
  defaultMenuOpen: PropTypes.bool,
  onActiveChanged: PropTypes.func,
  inSubmenu: PropTypes.bool,
  indicator: customPropTypes.shorthandAllowingChildren,
  onMenuOpenChange: PropTypes.func,
};

MenuItem.defaultProps = {
  as: 'a',
  wrapper: {},
  indicator: {},
};
