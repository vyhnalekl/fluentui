import { useIsomorphicLayoutEffect } from '@fluentui/react-bindings';
import { Ref, isRefObject } from '@fluentui/react-component-ref';
import * as PopperJs from '@popperjs/core';
import * as _ from 'lodash';
import * as React from 'react';

import { isBrowser } from '../isBrowser';
import { getBoundary } from './getBoundary';
import { getScrollParent } from './getScrollParent';
import { getPlacement, applyRtlToOffset } from './positioningHelper';
import { PopperModifiers, PopperProps } from './types';

/**
 * Memoize a result using deep equality. This hook has two advantages over
 * React.useMemo: it uses deep equality to compare memo keys, and it guarantees
 * that the memo function will only be called if the keys are unequal.
 * React.useMemo cannot be relied on to do this, since it is only a performance
 * optimization (see https://reactjs.org/docs/hooks-reference.html#usememo).
 *
 * Copied from https://github.com/apollographql/react-apollo/blob/master/packages/hooks/src/utils/useDeepMemo.ts.
 */
function useDeepMemo<TKey, TValue>(memoFn: () => TValue, key: TKey): TValue {
  const ref = React.useRef<{ key: TKey; value: TValue }>();

  if (!ref.current || !_.isEqual(key, ref.current.key)) {
    ref.current = { key, value: memoFn() };
  }

  return ref.current.value;
}

/** Checks if components was mounted the first time. */
function useFirstMount(): boolean {
  const isFirst = React.useRef(true);

  if (isFirst.current) {
    isFirst.current = false;
    return true;
  }

  return isFirst.current;
}

/** Executes useIsomorphicLayoutEffect during only updates. */
const useUpdateIsomorphicLayoutEffect: typeof React.useLayoutEffect = (effect, deps) => {
  const isFirstMount = useFirstMount();

  useIsomorphicLayoutEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
  }, deps);
};

/**
 * Popper relies on the 3rd party library [Popper.js](https://github.com/FezVrasta/popper.js) for positioning.
 */
export const Popper: React.FunctionComponent<PopperProps> = props => {
  const {
    align,
    children,
    enabled,
    flipBoundary,
    modifiers: userModifiers,
    offset,
    overflowBoundary,
    pointerTargetRef,
    position,
    positionFixed,
    positioningDependencies = [],
    rtl,
    targetRef,
    unstable_pinned,
  } = props;

  const proposedPlacement = getPlacement({ align, position, rtl });

  const popperRef = React.useRef<PopperJs.Instance>();
  const contentRef = React.useRef<HTMLElement>(null);

  const latestPlacement = React.useRef<PopperJs.Placement>(proposedPlacement);
  const [computedPlacement, setComputedPlacement] = React.useState<PopperJs.Placement>(proposedPlacement);

  const computedModifiers = useDeepMemo<any, PopperModifiers>(
    () => [
      offset && {
        name: 'offset',
        options: { offset: rtl ? applyRtlToOffset(offset) : offset },
      },
      ...userModifiers,
    ],
    [offset, flipBoundary, overflowBoundary, userModifiers],
  );

  const createInstance = React.useCallback(() => {
    const reference: Element | PopperJs.VirtualElement =
      targetRef && isRefObject(targetRef)
        ? (targetRef as React.RefObject<Element>).current
        : (targetRef as PopperJs.VirtualElement);

    if (!enabled || !reference || !contentRef.current) {
      return;
    }

    const handleUpdate = ({ state }: { state: Partial<PopperJs.State> }) => {
      // PopperJS performs computations that might update the computed placement: auto positioning, flipping the
      // placement in case the popper box should be rendered at the edge of the viewport and does not fit
      if (state.placement !== latestPlacement.current) {
        latestPlacement.current = state.placement;
        setComputedPlacement(state.placement);
      }
    };

    const hasDocument = isBrowser();
    const scrollParentElement: Node | null = hasDocument ? getScrollParent(contentRef.current) : null;

    const hasScrollableElement = scrollParentElement
      ? scrollParentElement !== scrollParentElement.ownerDocument.body
      : false;
    const hasPointer = !!(pointerTargetRef && pointerTargetRef.current);

    const modifiers: PopperModifiers = [
      { name: 'flip', options: { flipVariations: true } },

      /**
       * unstable_pinned disables the flip modifier by setting flip.enabled to false; this
       * disables automatic repositioning of the popper box; it will always be placed according to
       * the values of `align` and `position` props, regardless of the size of the component, the
       * reference element or the viewport.
       */
      unstable_pinned && { name: 'flip', enabled: false },

      /**
       * When the popper box is placed in the context of a scrollable element, we need to set
       * preventOverflow.escapeWithReference to true and flip.boundariesElement to 'scrollParent'
       * (default is 'viewport') so that the popper box will stick with the targetRef when we
       * scroll targetRef out of the viewport.
       */
      hasScrollableElement && { name: 'flip', options: { boundary: 'clippingParents' } },
      hasScrollableElement && { name: 'preventOverflow', options: { boundary: 'clippingParents' } },
    ];

    const options: PopperJs.Options = {
      placement: proposedPlacement,
      strategy: positionFixed ? 'fixed' : 'absolute',
      modifiers: [
        ...(modifiers as PopperJs.Options['modifiers']),

        ...computedModifiers,

        /**
         * This modifier is necessary in order to render the pointer. Refs are resolved in effects, so it can't be
         * placed under computed modifiers. Deep merge is not required as this modifier has only these properties.
         */
        {
          name: 'arrow',
          enabled: hasPointer,
          options: {
            element: pointerTargetRef && pointerTargetRef.current,
          },
        },

        flipBoundary && {
          name: 'flip',
          options: {
            altBoundary: true,
            boundary: getBoundary(contentRef.current, flipBoundary),
          },
        },
        overflowBoundary && {
          name: 'preventOverflow',
          options: {
            altBoundary: true,
            boundary: getBoundary(contentRef.current, overflowBoundary),
          },
        },

        {
          name: 'onUpdate',
          enabled: true,
          phase: 'afterWrite' as PopperJs.ModifierPhases,
          fn: handleUpdate,
        },
      ].filter(Boolean),
      onFirstUpdate: state => handleUpdate({ state }),
    };

    popperRef.current = PopperJs.createPopper(reference, contentRef.current, options);
  }, [
    contentRef,
    computedModifiers,
    enabled,
    flipBoundary,
    overflowBoundary,
    pointerTargetRef,
    positionFixed,
    proposedPlacement,
    targetRef,
    unstable_pinned,
  ]);

  const destroyInstance = React.useCallback(() => {
    if (popperRef.current) {
      popperRef.current.destroy();
      popperRef.current = null;
    }
  }, []);

  const scheduleUpdate = React.useCallback(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    createInstance();
    return destroyInstance;
  }, [createInstance]);

  useUpdateIsomorphicLayoutEffect(scheduleUpdate, [...positioningDependencies, computedPlacement]);

  const child =
    typeof children === 'function'
      ? children({ placement: computedPlacement, scheduleUpdate })
      : (children as React.ReactElement);

  return child ? <Ref innerRef={contentRef}>{React.Children.only(child)}</Ref> : null;
};

Popper.defaultProps = {
  enabled: true,
  modifiers: [],
  positionFixed: false,
  positioningDependencies: [],
};
