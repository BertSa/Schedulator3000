import React, { PropsWithChildren } from 'react';

export default function ErrorBoundary({ children }:PropsWithChildren<any>) {
  // eslint-disable-next-line no-console
  const backup = console.error;
  // eslint-disable-next-line no-console
  console.error = function filter(msg) {
    const suppressedWarnings = ['Warning: Using UNSAFE_component', 'Warning: %s is deprecated in StrictMode'];
    if (!suppressedWarnings.some((entry) => msg.includes(entry))) {
      backup.apply(console, [msg]);
    }
  };
  try {
    return children;
  } catch (e) {
    console.error(e);
    return <>Something happened!</>;
  }
}
