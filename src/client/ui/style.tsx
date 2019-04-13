// @ts-ignore
import resetCss from 'css-reset-and-normalize';
import React, { FC, ReactNode } from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  ${resetCss}

  body {
    font-size: medium;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: sans-serif;
  }
`;

interface IProps {
  children: ReactNode;
}

const Style: FC<IProps> = ({ children }) => (
  <>
    <GlobalStyle key='global-style' />
    {children}
  </>
);

export default Style;
