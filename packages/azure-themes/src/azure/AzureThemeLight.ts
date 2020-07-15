import { createTheme, ITheme } from 'office-ui-fabric-react';
import { CommonSemanticColors, LightSemanticColors } from './AzureColors';
import { IExtendedSemanticColors } from './IExtendedSemanticColors';
import { FontSizes } from './AzureType';
import * as StyleConstants from './Constants';

const lightExtendedSemanticColors: Partial<IExtendedSemanticColors> = {
  commandBarBorder: LightSemanticColors.commandBar.border,
  bodyBackground: LightSemanticColors.background,
  bodyText: LightSemanticColors.text.body,
  bodyTextHovered: LightSemanticColors.text.bodyHovered,
  bodyDivider: CommonSemanticColors.dividers.lineSeparator,
  buttonBackground: LightSemanticColors.secondaryButton.rest.background,
  buttonBackgroundChecked: LightSemanticColors.secondaryButton.pressed.background,
  buttonBackgroundCheckedHovered: LightSemanticColors.secondaryButton.hover.background,
  buttonBackgroundDisabled: LightSemanticColors.disabledButton.background,
  buttonBackgroundHovered: LightSemanticColors.secondaryButton.hover.background,
  buttonBackgroundPressed: LightSemanticColors.secondaryButton.pressed.background,
  buttonText: LightSemanticColors.secondaryButton.rest.text,
  buttonTextChecked: LightSemanticColors.secondaryButton.pressed.border,
  buttonTextCheckedHovered: LightSemanticColors.secondaryButton.hover.border,
  buttonTextDisabled: LightSemanticColors.disabledButton.text,
  buttonTextHovered: LightSemanticColors.secondaryButton.hover.color,
  buttonTextPressed: LightSemanticColors.secondaryButton.pressed.text,
  checkBoxBorder: LightSemanticColors.checkBox.rest.border,
  checkBoxBorderChecked: LightSemanticColors.checkBox.checked.border,
  checkBoxDisabled: LightSemanticColors.checkBox.disabled.border,
  checkBoxCheckHover: LightSemanticColors.checkBox.rest.hover,
  checkBoxCheckedFocus: LightSemanticColors.checkBox.rest.focus,
  checkBoxIndeterminateBackground: LightSemanticColors.checkBox.checked.background,
  checkBoxIndeterminateDefaultChecked: LightSemanticColors.checkBox.checked.default,
  disabledBackground: CommonSemanticColors.backgrounds.disabled,
  disabledBodyText: LightSemanticColors.text.disabled,
  errorBackground: LightSemanticColors.controlOutlines.error,
  errorText: LightSemanticColors.text.error,
  focusBorder: LightSemanticColors.controlOutlines.accent,
  inputBackground: LightSemanticColors.background,
  inputText: LightSemanticColors.text.value,
  inputBorder: LightSemanticColors.secondaryButton.rest.border,
  inputBorderHovered: LightSemanticColors.secondaryButton.hover.border,
  inputBorderPressed: LightSemanticColors.secondaryButton.pressed.border,
  inputPlaceholderText: LightSemanticColors.text.placeholder,
  link: LightSemanticColors.text.hyperlink,
  linkHovered: LightSemanticColors.text.hyperlinkHovered,
  listBackground: LightSemanticColors.background,
  listHeaderBackgroundPressed: LightSemanticColors.item.hover,
  listItemBackgroundChecked: LightSemanticColors.item.select,
  listItemBackgroundCheckedHovered: LightSemanticColors.item.select,
  listItemBackgroundHovered: LightSemanticColors.item.hover,
  listText: LightSemanticColors.text.body,
  menuItemBackgroundHovered: LightSemanticColors.item.hover,
  menuItemBackgroundPressed: LightSemanticColors.item.select,
  primaryButtonBackground: LightSemanticColors.primaryButton.rest.background,
  primaryButtonBackgroundDisabled: LightSemanticColors.disabledButton.background,
  primaryButtonBackgroundHovered: LightSemanticColors.primaryButton.hover.background,
  primaryButtonBackgroundPressed: LightSemanticColors.primaryButton.pressed.background,
  primaryButtonText: LightSemanticColors.primaryButton.rest.text,
  primaryButtonTextDisabled: LightSemanticColors.disabledButton.text,
  primaryButtonTextHovered: LightSemanticColors.primaryButton.hover.text,
  primaryButtonTextPressed: LightSemanticColors.primaryButton.pressed.text,
  toggleDisabledBackground: LightSemanticColors.toggle.disabled.backrgound,
  variantBorder: CommonSemanticColors.dividers.lineSeparator,
  // extended
  controlAccent: LightSemanticColors.controlOutlines.accent,
  controlOutline: LightSemanticColors.controlOutlines.rest,
  controlOutlineDisabled: LightSemanticColors.controlOutlines.disabled,
  controlOutlineHovered: LightSemanticColors.controlOutlines.hover,
  labelText: LightSemanticColors.text.label,
  statusErrorBackground: LightSemanticColors.statusBar.error,
  statusErrorText: LightSemanticColors.text.body,
  statusErrorIcon: CommonSemanticColors.icons.error,
  statusInformationBackground: LightSemanticColors.statusBar.information,
  statusInformationText: LightSemanticColors.text.body,
  statusInformationIcon: CommonSemanticColors.icons.information,
  statusSuccessBackground: LightSemanticColors.statusBar.okay,
  statusSuccessText: LightSemanticColors.text.body,
  statusSuccessIcon: CommonSemanticColors.icons.okay,
  statusWarningBackground: LightSemanticColors.statusBar.warning,
  statusWarningText: LightSemanticColors.text.body,
  statusWarningIcon: CommonSemanticColors.icons.warning,
};
export const AzureThemeLight: ITheme = createTheme({
  fonts: {
    medium: {
      fontFamily: StyleConstants.fontFamily,
      fontSize: FontSizes.size12,
    },
  },
  palette: {
    themePrimary: LightSemanticColors.controlOutlines.accent,
    neutralPrimary: LightSemanticColors.text.body,
    neutralDark: LightSemanticColors.text.body,
    neutralLight: LightSemanticColors.shimmer.secondary, // shimmer elements
    neutralLighter: LightSemanticColors.shimmer.primary, // shimmer elements
    neutralLighterAlt: LightSemanticColors.item.hover, // nav highlight
    neutralQuaternaryAlt: LightSemanticColors.item.select, // expand button on list controls
    neutralSecondary: LightSemanticColors.text.label, // persona
    white: LightSemanticColors.background, // shimmer elements
  },
  semanticColors: lightExtendedSemanticColors,
});
