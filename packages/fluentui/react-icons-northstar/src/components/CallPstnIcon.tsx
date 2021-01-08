import * as React from 'react';
import cx from 'classnames';
import { createSvgIcon } from '../utils/createSvgIcon';
import { iconClassNames } from '../utils/iconClassNames';

export const CallPstnIcon = createSvgIcon({
  svg: ({ classes }) => (
    <svg
      style={{ overflow: 'visible' }}
      role="presentation"
      focusable="false"
      viewBox="2 2 16 16"
      className={classes.svg}
    >
      <g className={cx(iconClassNames.filled, classes.filledPart)}>
        <path d="M9 2C6.79086 2 5 3.79086 5 6C5 8.20914 6.79086 10 9 10C11.2091 10 13 8.20914 13 6C13 3.79086 11.2091 2 9 2Z" />
        <path d="M4.00873 11C2.90315 11 2 11.8869 2 13C2 14.6912 2.83281 15.9663 4.13499 16.7966C5.41697 17.614 7.14526 18 9 18C9.87991 18 10.7314 17.9131 11.5202 17.7345C11.4602 17.3019 11.5355 16.8523 11.7481 16.4582L11.7603 16.4356L11.8431 16.2995L12.4297 15.4376C12.8741 14.7847 13.6617 14.4469 14.4461 14.614L14.4736 14.6199L14.6283 14.6621L15.1615 14.8399C15.3177 14.6721 15.4588 14.4811 15.5847 14.2646C15.7098 14.0495 15.8014 13.8408 15.8641 13.6376L15.3848 13.1827C14.8337 12.6597 14.6333 11.8805 14.8135 11.1724C14.565 11.0616 14.2897 11 14 11L4.00873 11Z" />
        <path d="M15.8345 11.2649L16.2337 10.3236C16.4209 9.88219 16.8693 9.64207 17.3091 9.73369L17.4031 9.75845L17.9029 9.91817C18.3986 10.0765 18.7781 10.5011 18.9007 11.0343C19.192 12.3013 18.8425 13.8439 17.8522 15.6622C16.8634 17.4777 15.7796 18.5694 14.6009 18.9371C14.1432 19.0798 13.6515 18.9761 13.2816 18.6656L13.1839 18.5758L12.8043 18.1947C12.4753 17.8644 12.4075 17.3419 12.6281 16.9331L12.6842 16.8409L13.2563 16.0003C13.4815 15.6695 13.8666 15.513 14.2377 15.5921L14.3384 15.6195L15.3947 15.9718C15.8162 15.6528 16.1677 15.2513 16.4491 14.7673C16.6904 14.3524 16.8481 13.9319 16.9225 13.5057L16.9527 13.2922L16.0732 12.4574C15.7835 12.1824 15.6782 11.7542 15.7967 11.3688L15.8345 11.2649Z" />
      </g>
      <g className={cx(iconClassNames.outline, classes.outlinePart)}>
        <path d="M5 6C5 3.79086 6.79086 2 9 2C11.2091 2 13 3.79086 13 6C13 8.20914 11.2091 10 9 10C6.79086 10 5 8.20914 5 6ZM9 3C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9C10.6569 9 12 7.65685 12 6C12 4.34315 10.6569 3 9 3Z" />
        <path d="M2 13C2 11.8869 2.90315 11 4.00873 11L14 11C14.2897 11 14.565 11.0616 14.8135 11.1724C14.7012 11.6137 14.7367 12.0827 14.9129 12.5H14.8662C14.6932 12.2011 14.3701 12 14 12L4.00873 12C3.44786 12 3 12.4467 3 13C3 14.3088 3.62226 15.2837 4.67262 15.9534C5.74318 16.636 7.26489 17 9 17C9.96178 17 10.858 16.8882 11.6482 16.6722C11.5131 17.0109 11.4708 17.3784 11.5202 17.7345C10.7314 17.9131 9.87991 18 9 18C7.14526 18 5.41697 17.614 4.13499 16.7966C2.83281 15.9663 2 14.6912 2 13Z" />
        <path d="M15.8345 11.2649L16.2337 10.3236C16.4209 9.88219 16.8693 9.64207 17.3091 9.73369L17.4031 9.75845L17.9029 9.91817C18.3986 10.0765 18.7781 10.5011 18.9007 11.0343C19.192 12.3013 18.8425 13.8439 17.8522 15.6622C16.8634 17.4777 15.7796 18.5694 14.6009 18.9371C14.1432 19.0798 13.6515 18.9761 13.2816 18.6656L13.1839 18.5758L12.8043 18.1947C12.4753 17.8644 12.4075 17.3419 12.6281 16.9331L12.6842 16.8409L13.2563 16.0003C13.4815 15.6695 13.8666 15.513 14.2377 15.5921L14.3384 15.6195L15.3947 15.9718C15.8162 15.6528 16.1677 15.2513 16.4491 14.7673C16.6904 14.3524 16.8481 13.9319 16.9225 13.5057L16.9527 13.2922L16.0732 12.4574C15.7835 12.1824 15.6782 11.7542 15.7967 11.3688L15.8345 11.2649Z" />
      </g>
    </svg>
  ),
  displayName: 'CallPstnIcon',
});
