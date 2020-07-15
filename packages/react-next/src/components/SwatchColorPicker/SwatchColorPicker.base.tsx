import * as React from 'react';
import {
  Async,
  classNamesFunction,
  findIndex,
  KeyCodes,
  getId,
  warnMutuallyExclusive,
  warnConditionallyRequiredProps,
} from '../../Utilities';
import {
  ISwatchColorPickerProps,
  ISwatchColorPickerStyleProps,
  ISwatchColorPickerStyles,
} from './SwatchColorPicker.types';
import { Grid } from '../../Utilities/grid/Grid';
import { IColorCellProps } from './ColorPickerGridCell.types';
import { ColorPickerGridCell } from './ColorPickerGridCell';
import { memoizeFunction, warnDeprecations } from '@uifabric/utilities';

export interface ISwatchColorPickerState {
  selectedIndex?: number;
}

const getClassNames = classNamesFunction<ISwatchColorPickerStyleProps, ISwatchColorPickerStyles>();

const COMPONENT_NAME = 'SwatchColorPicker';

export class SwatchColorPickerBase extends React.Component<ISwatchColorPickerProps, ISwatchColorPickerState> {
  public static defaultProps = {
    cellShape: 'circle',
    disabled: false,
    shouldFocusCircularNavigate: true,
    cellMargin: 10,
  } as ISwatchColorPickerProps;

  private _id: string;
  private _cellFocused: boolean;

  private navigationIdleTimeoutId: number | undefined;
  private isNavigationIdle: boolean;
  private readonly navigationIdleDelay: number = 250 /* ms */;
  private async: Async;

  // Add an index to each color cells. Memoizes this so that color cells do not re-render on every update.
  private _getItemsWithIndex = memoizeFunction((items: IColorCellProps[]) => {
    return items.map((item, index) => {
      return { ...item, index: index };
    });
  });

  constructor(props: ISwatchColorPickerProps) {
    super(props);

    this._id = props.id || getId('swatchColorPicker');

    if (process.env.NODE_ENV !== 'production') {
      warnMutuallyExclusive(COMPONENT_NAME, props, {
        focusOnHover: 'onHover',
      });

      warnConditionallyRequiredProps(
        COMPONENT_NAME,
        props,
        ['focusOnHover'],
        'mouseLeaveParentSelector',
        !!props.mouseLeaveParentSelector,
      );

      warnDeprecations(COMPONENT_NAME, props, {
        positionInSet: 'ariaPosInSet',
        setSize: 'ariaSetSize',
      });
    }

    this.isNavigationIdle = true;
    this.async = new Async(this);

    let selectedIndex: number | undefined;
    if (props.selectedId) {
      selectedIndex = this._getSelectedIndex(props.colorCells, props.selectedId);
    }

    this.state = {
      selectedIndex,
    };
  }

  public UNSAFE_componentWillReceiveProps(newProps: ISwatchColorPickerProps): void {
    if (newProps.selectedId !== undefined) {
      this.setState({
        selectedIndex: this._getSelectedIndex(newProps.colorCells, newProps.selectedId),
      });
    }
  }

  public componentWillUnmount() {
    if (this.props.onCellFocused && this._cellFocused) {
      this._cellFocused = false;
      this.props.onCellFocused();
    }
    this.async.dispose();
  }

  public render(): JSX.Element | null {
    const {
      colorCells,
      columnCount,
      // eslint-disable-next-line deprecation/deprecation
      ariaPosInSet = this.props.positionInSet,
      // eslint-disable-next-line deprecation/deprecation
      ariaSetSize = this.props.setSize,
      shouldFocusCircularNavigate,
      className,
      doNotContainWithinFocusZone,
      styles,
      cellMargin,
    } = this.props;

    const classNames = getClassNames(styles!, {
      theme: this.props.theme!,
      className,
      cellMargin,
    });

    if (colorCells.length < 1 || columnCount < 1) {
      return null;
    }
    return (
      <Grid
        {...this.props}
        id={this._id}
        items={this._getItemsWithIndex(colorCells)}
        columnCount={columnCount}
        onRenderItem={this._renderOption}
        ariaPosInSet={ariaPosInSet}
        ariaSetSize={ariaSetSize}
        shouldFocusCircularNavigate={shouldFocusCircularNavigate}
        doNotContainWithinFocusZone={doNotContainWithinFocusZone}
        onBlur={this._onSwatchColorPickerBlur}
        theme={this.props.theme!}
        styles={{
          root: classNames.root,
          tableCell: classNames.tableCell,
          focusedContainer: classNames.focusedContainer,
        }}
      />
    );
  }

  /**
   * When the whole swatchColorPicker is blurred,
   * make sure to clear the pending focused stated
   */
  private _onSwatchColorPickerBlur = (): void => {
    if (this.props.onCellFocused) {
      this._cellFocused = false;
      this.props.onCellFocused();
    }
  };

  /**
   * Get the selected item's index
   * @param items - The items to search
   * @param selectedId - The selected item's id to find
   * @returns - The index of the selected item's id, -1 if there was no match
   */
  private _getSelectedIndex(items: IColorCellProps[], selectedId: string): number | undefined {
    const selectedIndex = findIndex(items, item => item.id === selectedId);
    return selectedIndex >= 0 ? selectedIndex : undefined;
  }

  /**
   * Render a color cell
   * @param item - The item to render
   * @returns - Element representing the item
   */
  private _renderOption = (item: IColorCellProps): JSX.Element => {
    const props = this.props;
    const id = this._id;

    return (
      <ColorPickerGridCell
        item={item}
        idPrefix={id}
        color={item.color}
        styles={props.getColorGridCellStyles}
        disabled={props.disabled}
        onClick={this._onCellClick}
        onHover={this._onGridCellHovered}
        onFocus={this._onGridCellFocused}
        selected={this.state.selectedIndex !== undefined && this.state.selectedIndex === item.index}
        circle={props.cellShape === 'circle'}
        label={item.label}
        onMouseEnter={this._onMouseEnter}
        onMouseMove={this._onMouseMove}
        onMouseLeave={this._onMouseLeave}
        onWheel={this._onWheel}
        onKeyDown={this._onKeyDown}
        height={props.cellHeight}
        width={props.cellWidth}
        borderWidth={props.cellBorderWidth}
      />
    );
  };

  /**
   * Callback passed to the GridCell that will manage triggering the onCellHovered callback for mouseEnter
   */
  private _onMouseEnter = (ev: React.MouseEvent<HTMLButtonElement>): boolean => {
    if (!this.props.focusOnHover) {
      return !this.isNavigationIdle || !!this.props.disabled;
    }

    if (this.isNavigationIdle && !this.props.disabled) {
      ev.currentTarget.focus();
    }

    return true;
  };

  /**
   * Callback passed to the GridCell that will manage Hover/Focus updates
   */
  private _onMouseMove = (ev: React.MouseEvent<HTMLButtonElement>): boolean => {
    if (!this.props.focusOnHover) {
      return !this.isNavigationIdle || !!this.props.disabled;
    }

    const targetElement = ev.currentTarget as HTMLElement;

    // If navigation is idle and the targetElement is the focused element bail out
    // if (!this.isNavigationIdle || (document && targetElement === (document.activeElement as HTMLElement))) {
    if (this.isNavigationIdle && !(document && targetElement === (document.activeElement as HTMLElement))) {
      targetElement.focus();
    }

    return true;
  };

  /**
   * Callback passed to the GridCell that will manage Hover/Focus updates
   */
  private _onMouseLeave = (ev: React.MouseEvent<HTMLButtonElement>): void => {
    const parentSelector = this.props.mouseLeaveParentSelector;

    if (!this.props.focusOnHover || !parentSelector || !this.isNavigationIdle || this.props.disabled) {
      return;
    }

    // Get the elements that math the given selector
    const elements = document.querySelectorAll(parentSelector);

    // iterate over the elements return to make sure it is a parent of the target and focus it
    for (let index = 0; index < elements.length; index += 1) {
      if (elements[index].contains(ev.currentTarget)) {
        /**
         * IE11 focus() method forces parents to scroll to top of element.
         * Edge and IE expose a setActive() function for focusable divs that
         * sets the page focus but does not scroll the parent element.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((elements[index] as any).setActive) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (elements[index] as any).setActive();
          } catch (e) {
            /* no-op */
          }
        } else {
          (elements[index] as HTMLElement).focus();
        }

        break;
      }
    }
  };

  /**
   * Callback to make sure we don't update the hovered element during mouse wheel
   */
  private _onWheel = (): void => {
    this._setNavigationTimeout();
  };

  /**
   * Callback that
   */
  private _onKeyDown = (ev: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (
      ev.which === KeyCodes.up ||
      ev.which === KeyCodes.down ||
      ev.which === KeyCodes.left ||
      ev.which === KeyCodes.right
    ) {
      this._setNavigationTimeout();
    }
  };

  /**
   * Sets a timeout so we won't process any mouse "hover" events
   * while navigating (via mouseWheel or arrowKeys)
   */
  private _setNavigationTimeout = () => {
    if (!this.isNavigationIdle && this.navigationIdleTimeoutId !== undefined) {
      this.async.clearTimeout(this.navigationIdleTimeoutId);
      this.navigationIdleTimeoutId = undefined;
    } else {
      this.isNavigationIdle = false;
    }

    this.navigationIdleTimeoutId = this.async.setTimeout(() => {
      this.isNavigationIdle = true;
    }, this.navigationIdleDelay);
  };

  /**
   * Callback passed to the GridCell class that will trigger the onCellHovered callback of the SwatchColorPicker
   * NOTE: This will not be triggered if shouldFocusOnHover === true
   */
  private _onGridCellHovered = (item?: IColorCellProps): void => {
    const { onCellHovered } = this.props;

    if (onCellHovered) {
      return item ? onCellHovered(item.id, item.color) : onCellHovered();
    }
  };

  /**
   * Callback passed to the GridCell class that will trigger the onCellFocus callback of the SwatchColorPicker
   */
  private _onGridCellFocused = (item?: IColorCellProps): void => {
    const { onCellFocused } = this.props;
    if (onCellFocused) {
      if (item) {
        this._cellFocused = true;
        return onCellFocused(item.id, item.color);
      } else {
        this._cellFocused = false;
        return onCellFocused();
      }
    }
  };

  /**
   * Handle the click on a cell
   * @param item - The cell that the click was fired against
   */
  private _onCellClick = (item: IColorCellProps): void => {
    if (this.props.disabled) {
      return;
    }

    const index = item.index as number;

    // If we have a valid index and it is not already
    // selected, select it
    if (index >= 0 && index !== this.state.selectedIndex) {
      if (this.props.onCellFocused && this._cellFocused) {
        this._cellFocused = false;
        this.props.onCellFocused();
      }

      if (this.props.onColorChanged) {
        this.props.onColorChanged(item.id, item.color);
      }

      // Update internal state only if the component is uncontrolled
      if (this.props.isControlled !== true) {
        this.setState({
          selectedIndex: index,
        });
      }
    }
  };
}
