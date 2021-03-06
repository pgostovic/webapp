import React, { FC, SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button';
import Input from '../../common/Input';

interface IProps {
  onSignIn: (email: string, password: string) => void;
  errorMessage?: string;
}

export const View: FC<IProps> = ({ onSignIn, errorMessage }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        data-testid='email'
        type='text'
        placeholder='Email address'
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Input
        data-testid='password'
        type='password'
        placeholder='Password'
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Button data-testid='sign-in-button'>Sign In</Button>
      {errorMessage && <p data-testid='error-message'>{errorMessage}</p>}
      <p>
        Need an account? <Link to='/sign-up'>Sign Up</Link>
      </p>
    </form>
  );
};
