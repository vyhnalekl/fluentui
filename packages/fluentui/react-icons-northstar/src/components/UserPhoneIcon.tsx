import * as React from 'react';
import cx from 'classnames';
import { createSvgIcon } from '../utils/createSvgIcon';
import { iconClassNames } from '../utils/iconClassNames';

export const UserPhoneIcon = createSvgIcon({
  svg: ({ classes }) => (
    <svg
      style={{ overflow: 'visible' }}
      role="presentation"
      focusable="false"
      viewBox="2 2 16 16"
      className={classes.svg}
    >
      <g className={cx(iconClassNames.outline, classes.outlinePart)}>
        <path d="M2 5.5C2 4.67157 2.67157 4 3.5 4H16.5C17.3284 4 18 4.67157 18 5.5V8.90587C17.8584 8.84315 17.4739 8.69751 17 8.72005V5.5C17 5.22386 16.7761 5 16.5 5H3.5C3.22386 5 3 5.22386 3 5.5V14.5C3 14.7761 3.22386 15 3.5 15H6V13.5C6 12.6716 6.67157 12 7.5 12H12.5C13.3284 12 14 12.6716 14 13.5V14.5742C13.5886 14.5873 13.2623 14.7143 13 14.8908V13.5C13 13.2239 12.7761 13 12.5 13H7.5C7.22386 13 7 13.2239 7 13.5V15H12.8526C12.5378 15.2558 12.3277 15.5758 12.1737 15.8104C12.1259 15.8833 12.0834 15.9481 12.0449 16H3.5C2.67157 16 2 15.3284 2 14.5V5.5Z" />
        <path d="M10 11C11.3807 11 12.5 9.88071 12.5 8.5C12.5 7.11929 11.3807 6 10 6C8.61929 6 7.5 7.11929 7.5 8.5C7.5 9.88071 8.61929 11 10 11ZM10 10C9.17157 10 8.5 9.32843 8.5 8.5C8.5 7.67157 9.17157 7 10 7C10.8284 7 11.5 7.67157 11.5 8.5C11.5 9.32843 10.8284 10 10 10Z" />
        <path d="M15.8345 11.2649L16.2337 10.3236C16.4209 9.88219 16.8693 9.64207 17.3091 9.73369L17.4031 9.75845L17.9029 9.91817C18.3986 10.0765 18.7781 10.5011 18.9007 11.0343C19.192 12.3013 18.8425 13.8439 17.8522 15.6622C16.8634 17.4777 15.7796 18.5694 14.6009 18.9371C14.1432 19.0798 13.6515 18.9761 13.2816 18.6656L13.1839 18.5758L12.8043 18.1947C12.4753 17.8644 12.4075 17.3419 12.6281 16.9331L12.6842 16.8409L13.2563 16.0003C13.4815 15.6695 13.8666 15.513 14.2377 15.5921L14.3384 15.6195L15.3947 15.9718C15.8162 15.6528 16.1677 15.2513 16.4491 14.7673C16.6904 14.3524 16.8481 13.9319 16.9225 13.5057L16.9527 13.2922L16.0732 12.4574C15.7835 12.1824 15.6782 11.7542 15.7967 11.3688L15.8345 11.2649Z" />
      </g>
      <g className={cx(iconClassNames.filled, classes.filledPart)}>
        <path d="M2 5.5C2 4.67157 2.67157 4 3.5 4H16.5C17.3284 4 18 4.67157 18 5.5V8.90587C17.8584 8.84315 17.4739 8.69751 17 8.72005V5.5C17 5.22386 16.7761 5 16.5 5H3.5C3.22386 5 3 5.22386 3 5.5V14.5C3 14.7761 3.22386 15 3.5 15H6V13.5C6 12.6716 6.67157 12 7.5 12H12.5C13.3284 12 14 12.6716 14 13.5V14.5742C12.9635 14.6072 12.467 15.3637 12.1737 15.8104C12.1259 15.8834 12.0834 15.9481 12.0449 16H3.5C2.67157 16 2 15.3284 2 14.5V5.5Z" />
        <path d="M12.5 8.5C12.5 9.88071 11.3807 11 10 11C8.61929 11 7.5 9.88071 7.5 8.5C7.5 7.11929 8.61929 6 10 6C11.3807 6 12.5 7.11929 12.5 8.5Z" />
        <path d="M15.8345 11.2649L16.2337 10.3236C16.4209 9.88219 16.8693 9.64207 17.3091 9.73369L17.4031 9.75845L17.9029 9.91817C18.3986 10.0765 18.7781 10.5011 18.9007 11.0343C19.192 12.3013 18.8425 13.8439 17.8522 15.6622C16.8634 17.4777 15.7796 18.5694 14.6009 18.9371C14.1432 19.0798 13.6515 18.9761 13.2816 18.6656L13.1839 18.5758L12.8043 18.1947C12.4753 17.8644 12.4075 17.3419 12.6281 16.9331L12.6842 16.8409L13.2563 16.0003C13.4815 15.6695 13.8666 15.513 14.2377 15.5921L14.3384 15.6195L15.3947 15.9718C15.8162 15.6528 16.1677 15.2513 16.4491 14.7673C16.6904 14.3524 16.8481 13.9319 16.9225 13.5057L16.9527 13.2922L16.0732 12.4574C15.7835 12.1824 15.6782 11.7542 15.7967 11.3688L15.8345 11.2649Z" />
      </g>
    </svg>
  ),
  displayName: 'UserPhoneIcon',
});
