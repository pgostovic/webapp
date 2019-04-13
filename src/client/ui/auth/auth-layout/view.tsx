import React, { FC } from 'react';
import styled from 'styled-components';

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Panel = styled.div`
  width: 500px;
  height: 300px;
  background-color: #ccc;
`;

export const View: FC = ({ children }) => (
  <Main>
    <Panel>{children}</Panel>
  </Main>
);
