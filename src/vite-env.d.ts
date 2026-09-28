/// <reference types="vite/client" />
import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      marquee: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { direction?: string; scrollamount?: string }, HTMLElement>;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      marquee: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { direction?: string; scrollamount?: string }, HTMLElement>;
    }
  }
}

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      marquee: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { direction?: string; scrollamount?: string }, HTMLElement>;
    }
  }
}

declare module 'react/jsx-dev-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      marquee: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { direction?: string; scrollamount?: string }, HTMLElement>;
    }
  }
}


