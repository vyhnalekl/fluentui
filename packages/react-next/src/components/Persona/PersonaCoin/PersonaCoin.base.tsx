import * as React from 'react';
import {
  warnDeprecations,
  classNamesFunction,
  divProperties,
  getInitials,
  getNativeProps,
  getRTL,
} from '../../../Utilities';
import { mergeStyles } from '../../../Styling';
import { PersonaPresence } from '../PersonaPresence/index';
import { Icon } from '../../../Icon';
import { Image, ImageFit, ImageLoadState } from '../../../Image';
import {
  IPersonaCoinProps,
  IPersonaCoinStyleProps,
  IPersonaCoinStyles,
  IPersonaPresenceProps,
  PersonaPresence as PersonaPresenceEnum,
  PersonaSize,
} from '../Persona.types';
import { getPersonaInitialsColor } from '../PersonaInitialsColor';
import { sizeToPixels } from '../PersonaConsts';
import { getPropsWithDefaults } from '@fluentui/react-next';

const getClassNames = classNamesFunction<IPersonaCoinStyleProps, IPersonaCoinStyles>({
  // There can be many PersonaCoin rendered with different sizes.
  // Therefore setting a larger cache size.
  cacheSize: 100,
});

const DEFAULT_PROPS = {
  size: PersonaSize.size48,
  presence: PersonaPresenceEnum.none,
  imageAlt: '',
};

function useWarnDeprecation(props: IPersonaCoinProps) {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      warnDeprecations('PersonaCoin', props, { primaryText: 'text' });
    }
  }, []);
}

function useImageLoadState({ onPhotoLoadingStateChange, imageUrl }: IPersonaCoinProps) {
  const [imageLoadState, setImageLoadstate] = React.useState<ImageLoadState>(ImageLoadState.notLoaded);

  React.useEffect(() => {
    setImageLoadstate(ImageLoadState.notLoaded);
  }, [imageUrl]);

  const onLoadingStateChange = (loadState: ImageLoadState) => {
    setImageLoadstate(loadState);

    onPhotoLoadingStateChange?.(loadState);
  };

  return [imageLoadState, onLoadingStateChange] as const;
}

/**
 * PersonaCoin with no default styles.
 * [Use the `getStyles` API to add your own styles.](https://github.com/microsoft/fluentui/wiki/Styling)
 */
export const PersonaCoinBase = React.forwardRef(
  (propsWithoutDefaults: IPersonaCoinProps, forwardedRef: React.Ref<HTMLDivElement>) => {
    const props = getPropsWithDefaults(DEFAULT_PROPS, propsWithoutDefaults);

    useWarnDeprecation(props);

    const [imageLoadState, onLoadingStateChange] = useImageLoadState(props);

    const renderCoin = getCoinRenderer(onLoadingStateChange);

    const {
      className,
      coinProps,
      showUnknownPersonaCoin,
      coinSize,
      styles,
      imageUrl,
      isOutOfOffice,
      // eslint-disable-next-line deprecation/deprecation
      onRenderCoin = renderCoin,
      // eslint-disable-next-line deprecation/deprecation
      onRenderPersonaCoin = onRenderCoin,
      onRenderInitials = renderPersonaCoinInitials,
      presence,
      presenceTitle,
      presenceColors,
      showInitialsUntilImageLoads,
      theme,
      size,
    } = props;

    const divProps = getNativeProps<React.HTMLAttributes<HTMLDivElement>>(props, divProperties);
    const divCoinProps = getNativeProps<React.HTMLAttributes<HTMLDivElement>>(coinProps || {}, divProperties);
    const coinSizeStyle = coinSize ? { width: coinSize, height: coinSize } : undefined;
    const hideImage = showUnknownPersonaCoin;

    const personaPresenceProps: IPersonaPresenceProps = {
      coinSize,
      isOutOfOffice,
      presence,
      presenceTitle,
      presenceColors,
      size,
      theme,
    };

    // Use getStyles from props, or fall back to getStyles from styles file.
    const classNames = getClassNames(styles, {
      theme: theme!,
      className: coinProps && coinProps.className ? coinProps.className : className,
      size,
      coinSize,
      showUnknownPersonaCoin,
    });

    const shouldRenderInitials = Boolean(
      imageLoadState !== ImageLoadState.loaded &&
        ((showInitialsUntilImageLoads && imageUrl) ||
          !imageUrl ||
          imageLoadState === ImageLoadState.error ||
          hideImage),
    );

    return (
      <div role="presentation" {...divProps} className={classNames.coin} ref={forwardedRef}>
        {// Render PersonaCoin if size is not size8. size10 and tiny need to removed after a deprecation cleanup.
        // eslint-disable-next-line deprecation/deprecation
        size !== PersonaSize.size8 && size !== PersonaSize.size10 && size !== PersonaSize.tiny ? (
          <div role="presentation" {...divCoinProps} className={classNames.imageArea} style={coinSizeStyle}>
            {shouldRenderInitials && (
              <div
                className={mergeStyles(
                  classNames.initials,
                  !showUnknownPersonaCoin && { backgroundColor: getPersonaInitialsColor(props) },
                )}
                style={coinSizeStyle}
                aria-hidden="true"
              >
                {onRenderInitials(props, renderPersonaCoinInitials)}
              </div>
            )}
            {!hideImage && onRenderPersonaCoin(props, renderCoin)}
            <PersonaPresence {...personaPresenceProps} />
          </div>
        ) : // Otherwise, render just PersonaPresence.
        props.presence ? (
          <PersonaPresence {...personaPresenceProps} />
        ) : (
          // Just render Contact Icon if there isn't a Presence prop.
          <Icon iconName="Contact" className={classNames.size10WithoutPresenceIcon} />
        )}
        {props.children}
      </div>
    );
  },
);
PersonaCoinBase.displayName = 'PersonaCoinBase';

const getCoinRenderer = (onLoadingStateChange: (loadState: ImageLoadState) => void) => ({
  coinSize,
  styles,
  imageUrl,
  imageAlt,
  imageShouldFadeIn,
  imageShouldStartVisible,
  theme,
  showUnknownPersonaCoin,
  size = DEFAULT_PROPS.size,
}: IPersonaCoinProps): JSX.Element | null => {
  // Render the Image component only if an image URL is provided
  if (!imageUrl) {
    return null;
  }
  const classNames = getClassNames(styles, {
    theme: theme!,
    size,
    showUnknownPersonaCoin,
  });
  const dimension = coinSize || sizeToPixels[size];
  return (
    <Image
      className={classNames.image}
      imageFit={ImageFit.cover}
      src={imageUrl}
      width={dimension}
      height={dimension}
      alt={imageAlt}
      shouldFadeIn={imageShouldFadeIn}
      shouldStartVisible={imageShouldStartVisible}
      onLoadingStateChange={onLoadingStateChange}
    />
  );
};

const renderPersonaCoinInitials = ({
  imageInitials,
  allowPhoneInitials,
  showUnknownPersonaCoin,
  text,
  // eslint-disable-next-line deprecation/deprecation
  primaryText,
  theme,
}: IPersonaCoinProps): JSX.Element => {
  if (showUnknownPersonaCoin) {
    return <Icon iconName="Help" />;
  }

  const isRTL = getRTL(theme);

  imageInitials = imageInitials || getInitials(text || primaryText || '', isRTL, allowPhoneInitials);

  return imageInitials !== '' ? <span>{imageInitials}</span> : <Icon iconName="Contact" />;
};
