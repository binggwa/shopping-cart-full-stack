import { css } from '@emotion/react';

export const resetStyles = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
      sans-serif;
    color: #000000;
    -webkit-font-smoothing: antialiased;
  }

  button {
    font-family: inherit;
    border: none;
    cursor: pointer;
  }

  p,
  h1,
  h2,
  h3 {
    margin: 0;
  }
`;
