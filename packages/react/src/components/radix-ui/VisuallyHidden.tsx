import * as React from 'react';
import { Primitive } from './Primitive';

/* -------------------------------------------------------------------------------------------------
 * VisuallyHidden
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'VisuallyHidden';

type VisuallyHiddenElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface VisuallyHiddenProps extends PrimitiveSpanProps {}

const VisuallyHidden = React.forwardRef<VisuallyHiddenElement, VisuallyHiddenProps>(
  (props, forwardedRef) => {
    return (
      <Primitive.span
        {...props}
        ref={forwardedRef}
        style={{
          // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
          position: 'absolute',
          border: 0,
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          wordWrap: 'normal',
          ...props.style,
        }}
      />
    );
  }
);

VisuallyHidden.displayName = NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = VisuallyHidden;

export {
  VisuallyHidden,
  //
  Root,
};
export type { VisuallyHiddenProps };
