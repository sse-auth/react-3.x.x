import * as React from 'react';
import { createContextScope } from './createContext';
import { useCallbackRef } from './useCallbackRef';
import { useLayoutEffect } from './useLayoutEffect';
import { Primitive } from './Primitive';

import type { Scope } from './createContext';

/* -------------------------------------------------------------------------------------------------
 * Avatar
 * -----------------------------------------------------------------------------------------------*/

const AVATAR_NAME = 'Avatar';

type ScopedProps<P> = P & { __scopeAvatar?: Scope };
const [createAvatarContext, createAvatarScope] = createContextScope(AVATAR_NAME);

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

type AvatarContextValue = {
  imageLoadingStatus: ImageLoadingStatus;
  onImageLoadingStatusChange(status: ImageLoadingStatus): void;
};

const [AvatarProvider, useAvatarContext] = createAvatarContext<AvatarContextValue>(AVATAR_NAME);

type AvatarElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface AvatarProps extends PrimitiveSpanProps {}

const Avatar = React.forwardRef<AvatarElement, AvatarProps>(
  (props: ScopedProps<AvatarProps>, forwardedRef) => {
    const { __scopeAvatar, ...avatarProps } = props;
    const [imageLoadingStatus, setImageLoadingStatus] = React.useState<ImageLoadingStatus>('idle');
    return (
      <AvatarProvider
        scope={__scopeAvatar}
        imageLoadingStatus={imageLoadingStatus}
        onImageLoadingStatusChange={setImageLoadingStatus}
      >
        <Primitive.span {...avatarProps} ref={forwardedRef} />
      </AvatarProvider>
    );
  }
);

Avatar.displayName = AVATAR_NAME;

/* -------------------------------------------------------------------------------------------------
 * AvatarImage
 * -----------------------------------------------------------------------------------------------*/

const IMAGE_NAME = 'AvatarImage';

type AvatarImageElement = React.ElementRef<typeof Primitive.img>;
type PrimitiveImageProps = React.ComponentPropsWithoutRef<typeof Primitive.img>;
interface AvatarImageProps extends PrimitiveImageProps {
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
}

const AvatarImage = React.forwardRef<AvatarImageElement, AvatarImageProps>(
  (props: ScopedProps<AvatarImageProps>, forwardedRef) => {
    const { __scopeAvatar, src, onLoadingStatusChange = () => {}, ...imageProps } = props;
    const context = useAvatarContext(IMAGE_NAME, __scopeAvatar);
    const imageLoadingStatus = useImageLoadingStatus(src, imageProps.referrerPolicy);
    const handleLoadingStatusChange = useCallbackRef((status: ImageLoadingStatus) => {
      onLoadingStatusChange(status);
      context.onImageLoadingStatusChange(status);
    });

    useLayoutEffect(() => {
      if (imageLoadingStatus !== 'idle') {
        handleLoadingStatusChange(imageLoadingStatus);
      }
    }, [imageLoadingStatus, handleLoadingStatusChange]);

    return imageLoadingStatus === 'loaded' ? (
      <Primitive.img {...imageProps} ref={forwardedRef} src={src} />
    ) : null;
  }
);

AvatarImage.displayName = IMAGE_NAME;

/* -------------------------------------------------------------------------------------------------
 * AvatarFallback
 * -----------------------------------------------------------------------------------------------*/

const FALLBACK_NAME = 'AvatarFallback';

type AvatarFallbackElement = React.ElementRef<typeof Primitive.span>;
interface AvatarFallbackProps extends PrimitiveSpanProps {
  delayMs?: number;
}

const AvatarFallback = React.forwardRef<AvatarFallbackElement, AvatarFallbackProps>(
  (props: ScopedProps<AvatarFallbackProps>, forwardedRef) => {
    const { __scopeAvatar, delayMs, ...fallbackProps } = props;
    const context = useAvatarContext(FALLBACK_NAME, __scopeAvatar);
    const [canRender, setCanRender] = React.useState(delayMs === undefined);

    React.useEffect(() => {
      if (delayMs !== undefined) {
        const timerId = window.setTimeout(() => setCanRender(true), delayMs);
        return () => window.clearTimeout(timerId);
      }
    }, [delayMs]);

    return canRender && context.imageLoadingStatus !== 'loaded' ? (
      <Primitive.span {...fallbackProps} ref={forwardedRef} />
    ) : null;
  }
);

AvatarFallback.displayName = FALLBACK_NAME;

/* -----------------------------------------------------------------------------------------------*/

function useImageLoadingStatus(src?: string, referrerPolicy?: React.HTMLAttributeReferrerPolicy) {
  const [loadingStatus, setLoadingStatus] = React.useState<ImageLoadingStatus>('idle');

  useLayoutEffect(() => {
    if (!src) {
      setLoadingStatus('error');
      return;
    }

    let isMounted = true;
    const image = new window.Image();

    const updateStatus = (status: ImageLoadingStatus) => () => {
      if (!isMounted) return;
      setLoadingStatus(status);
    };

    setLoadingStatus('loading');
    image.onload = updateStatus('loaded');
    image.onerror = updateStatus('error');
    image.src = src;
    if (referrerPolicy) {
      image.referrerPolicy = referrerPolicy;
    }

    return () => {
      isMounted = false;
    };
  }, [src, referrerPolicy]);

  return loadingStatus;
}
const Root = Avatar;
const Image = AvatarImage;
const Fallback = AvatarFallback;

export {
  createAvatarScope,
  //
  Avatar,
  AvatarImage,
  AvatarFallback,
  //
  Root,
  Image,
  Fallback,
};
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps };
