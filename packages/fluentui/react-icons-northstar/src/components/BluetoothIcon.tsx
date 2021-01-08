import * as React from 'react';
import cx from 'classnames';
import { createSvgIcon } from '../utils/createSvgIcon';
import { iconClassNames } from '../utils/iconClassNames';

export const BluetoothIcon = createSvgIcon({
  svg: ({ classes }) => (
    <svg role="presentation" focusable="false" viewBox="2 2 16 16" className={classes.svg}>
      <path
        className={cx(iconClassNames.outline, classes.outlinePart)}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.32233 2.03264C8.51637 1.95886 8.73581 2.01266 8.87373 2.16782L12.8737 6.66782C12.9653 6.77086 13.0103 6.90716 12.998 7.04449C12.9858 7.18181 12.9173 7.30798 12.8089 7.39316L9.49113 10L12.8089 12.6068C12.9173 12.692 12.9858 12.8182 12.998 12.9555C13.0103 13.0928 12.9653 13.2291 12.8737 13.3322L8.87373 17.8322C8.73581 17.9873 8.51637 18.0411 8.32233 17.9674C8.12829 17.8936 8.00002 17.7076 8.00002 17.5V11.1716L5.80893 12.8932C5.5918 13.0638 5.27747 13.026 5.10686 12.8089C4.93626 12.5918 4.97397 12.2774 5.19111 12.1068L7.87254 10L5.19111 7.89316C4.97397 7.72255 4.93626 7.40822 5.10686 7.19109C5.27747 6.97395 5.5918 6.93623 5.80893 7.10684L8.00002 8.82841V2.5C8.00002 2.29241 8.12829 2.10641 8.32233 2.03264ZM9.00002 10.8859L11.7733 13.0649L9.00002 16.1849V10.8859ZM9.00002 9.11412V3.8151L11.7733 6.93508L9.00002 9.11412Z"
      />
      <path
        className={cx(iconClassNames.filled, classes.filledPart)}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.53425 2.04342C8.83314 1.93704 9.16663 2.03023 9.36708 2.27614L12.8314 6.52614C12.9574 6.68077 13.0167 6.87925 12.996 7.07767C12.9753 7.27609 12.8765 7.45811 12.7213 7.58346L9.72937 10L12.7213 12.4165C12.8765 12.5419 12.9753 12.7239 12.996 12.9223C13.0167 13.1208 12.9574 13.3192 12.8314 13.4739L9.36708 17.7239C9.16663 17.9698 8.83314 18.063 8.53425 17.9566C8.23536 17.8502 8.03574 17.5673 8.03574 17.25V11.3679L6.22128 12.8335C5.89904 13.0937 5.42684 13.0435 5.16657 12.7213C4.9063 12.399 4.95654 11.9268 5.27877 11.6665L7.34211 10L5.27877 8.33346C4.95654 8.07319 4.9063 7.60098 5.16657 7.27875C5.42684 6.95651 5.89904 6.90628 6.22128 7.16654L8.03574 8.63207V2.75C8.03574 2.43274 8.23536 2.14981 8.53425 2.04342ZM9.53574 11.7718L11.1927 13.1101L9.53574 15.1428V11.7718ZM9.53574 8.22822V4.85715L11.1927 6.88991L9.53574 8.22822Z"
      />
    </svg>
  ),
  displayName: 'BluetoothIcon',
});
