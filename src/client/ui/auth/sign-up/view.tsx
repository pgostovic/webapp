import React, { FC, SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button';
import Input from '../../common/Input';

interface IProps {
  onSignUp: (email: string) => void;
  errorMessage?: string;
  successMessage?: string;
}

export const View: FC<IProps> = props => {
  const [email, setEmail] = useState<string>('');

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    props.onSignUp(email);
  };

  return (
    <form onSubmit={onSubmit}>
      <Input type='text' placeholder='Email address' value={email} onChange={e => setEmail(e.target.value)} />
      <Button>Sign Up</Button>
      <p>{props.errorMessage}</p>
      <p>{props.successMessage}</p>
      <p>
        Already have an account? <Link to='/sign-in'>Sign In</Link>
      </p>
    </form>
  );
};
