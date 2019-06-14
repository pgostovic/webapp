import React, { FC, SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { i18n } from '../../../../lib/i18n';
import Button from '../../common/Button';
import Input from '../../common/Input';

interface IProps {
  onSignUp: (email: string) => void;
  errorMessage?: string;
  successMessage?: string;
}

export const View: FC<IProps> = ({ errorMessage, successMessage, onSignUp }) => {
  const [email, setEmail] = useState<string>('');

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSignUp(email);
  };

  return (
    <form onSubmit={onSubmit}>
      <Input type='text' placeholder='Email address' value={email} onChange={e => setEmail(e.target.value)} />
      <Button data-testid='sign-up-button'>{i18n('auth.sign-up.sign-up-button')}</Button>
      {errorMessage && <p data-testid='error-message'>{errorMessage}</p>}
      {successMessage && <p>{successMessage}</p>}
      <p>
        Already have an account? <Link to='/sign-in'>Sign In</Link>
      </p>
    </form>
  );
};

// const i18n = (key: string) => {
//   return `i18n:${key}`;
// };
