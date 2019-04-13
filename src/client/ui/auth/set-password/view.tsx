import React, { FC, SyntheticEvent, useState } from 'react';
import Button from '../../common/Button';
import Input from '../../common/Input';

interface IProps {
  onSetPassword: (email: string) => void;
  errorMessage?: string;
}

export const View: FC<IProps> = ({ onSetPassword, errorMessage }) => {
  const [password, setPassword] = useState<string>('');

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSetPassword(password);
  };

  return (
    <form onSubmit={onSubmit}>
      <Input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
      <Button>Set Password</Button>
      <p>{errorMessage}</p>
    </form>
  );
};
