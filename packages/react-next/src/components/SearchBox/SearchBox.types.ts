import * as React from 'react';
import { IButtonProps } from '@fluentui/react-next/lib/compat/Button';
import { ITheme, IStyle } from '../../Styling';
import { IStyleFunctionOrObject } from '../../Utilities';
import { IIconProps } from '../../Icon';

/**
 * {@docCategory SearchBox}
 */
export interface ISearchBox {
  /**
   * Sets focus inside the search input box.
   */
  focus(): void;

  /**
   * Returns whether or not the SearchBox has focus
   */
  hasFocus(): boolean;
}

/**
 * {@docCategory SearchBox}
 */
export interface ISearchBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Optional callback to access the ISearchBox interface. Use this instead of ref for accessing
   * the public methods and properties of the component.
   */
  componentRef?: React.Ref<ISearchBox>;

  /**
   * Placeholder for the search box.
   */
  placeholder?: string;

  /**
   * Deprecated. Use `placeholder` instead.
   * @deprecated Use `placeholder` instead.
   */
  labelText?: string;

  /**
   * Callback function for when the typed input for the SearchBox has changed.
   */
  onChange?: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;

  /**
   * Callback executed when the user presses enter in the search box.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSearch?: (newValue: any) => void;

  /**
   * Callback executed when the user clears the search box by either clicking 'X' or hitting escape.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClear?: (ev?: any) => void;

  /**
   * Callback executed when the user presses escape in the search box.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEscape?: (ev?: any) => void;

  /**
   * Deprecated at v0.52.2, use `onChange` instead.
   * @deprecated Use `onChange` instead.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChanged?: (newValue: any) => void;

  /**
   * The value of the text in the SearchBox.
   */
  value?: string;

  /**
   * The default value of the text in the SearchBox, in the case of an uncontrolled component.
   */
  defaultValue?: string;

  /**
   * CSS class to apply to the SearchBox.
   */
  className?: string;

  /**
   * The aria label of the SearchBox for the benefit of screen readers.
   */
  ariaLabel?: string;

  /**
   * The props for the clear button.
   */
  clearButtonProps?: IButtonProps;

  /**
   * The props for the icon.
   */
  iconProps?: Pick<IIconProps, Exclude<keyof IIconProps, 'className'>>;

  /**
   * Whether or not the SearchBox is underlined.
   * @defaultvalue false
   */
  underlined?: boolean;

  /**
   * Theme (provided through customization).
   */
  theme?: ITheme;

  /**
   * Call to provide customized styling that will layer on top of the variant rules.
   */
  styles?: IStyleFunctionOrObject<ISearchBoxStyleProps, ISearchBoxStyles>;

  /**
   * Whether or not to animate the SearchBox icon on focus.
   * @defaultvalue false
   */
  disableAnimation?: boolean;
}

/**
 * {@docCategory SearchBox}
 */
export interface ISearchBoxStyleProps {
  theme: ITheme;
  className?: string;
  disabled?: boolean;
  hasFocus?: boolean;
  underlined?: boolean;
  hasInput?: boolean;
  disableAnimation?: boolean;
}

/**
 * {@docCategory SearchBox}
 */
export interface ISearchBoxStyles {
  root?: IStyle;
  iconContainer?: IStyle;
  icon?: IStyle;
  field?: IStyle;
  clearButton?: IStyle;
}
