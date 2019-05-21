import { inject } from '@phnq/state';
import React, { FC, ReactNode, useEffect } from 'react';
import { configure } from './api';
import { IAuthStateProps } from './state/auth';
import UI from './ui';

interface IProps {
  server: {
    secure: boolean;
    host: string;
    port: number;
  };
  children: ReactNode;
}

export const WebappClient: FC<IProps> = ({ server, children }: IProps) => {
  useEffect(() => {
    configure(server);
  }, [server]);
  return <UI {...inject<IAuthStateProps>()}>{children}</UI>;
};
