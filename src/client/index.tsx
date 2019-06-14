import { inject } from '@phnq/state';
import React, { FC, ReactNode, useEffect } from 'react';
import { addL10n, setDefaultLanguages } from '../lib/i18n';
import { configure } from './api';
import { IAuthStateProps } from './state/auth';
import UI from './ui';

// tslint:disable-next-line: no-var-requires
addL10n('en', require('../l10n/en.json'));

setDefaultLanguages(navigator.languages);

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
