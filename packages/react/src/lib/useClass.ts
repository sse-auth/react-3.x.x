import React from 'react';

export const useBodyClass = (className: string | string[]) => {
  React.useEffect(() => {
    const classes = Array.isArray(className) ? className : className.split(' ').filter(Boolean);

    classes.forEach((cls) => {
      document.body.classList.add(cls);
    });

    return () => {
      classes.forEach((cls) => {
        document.body.classList.remove(cls);
      });
    };
  }, [className]);
};

export const useHTMLClass = (className: string | string[]) => {
  React.useEffect(() => {
    const classes = Array.isArray(className) ? className : className.split(' ').filter(Boolean);

    classes.forEach((cls) => {
      document.documentElement.classList.add(cls);
    });

    return () => {
      classes.forEach((cls) => {
        document.documentElement.classList.remove(cls);
      });
    };
  }, [className]);
};
