import React, { FC, SyntheticEvent, useState } from 'react';
import Button from '../../common/Button';
import Input from '../../common/Input';

interface IProps {
  onSubmitCode: (code: string) => void;
  errorMessage?: string;
}

export const View: FC<IProps> = ({ onSubmitCode, errorMessage }) => {
  const [code, setCode] = useState<string>('');

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSubmitCode(code);
  };

  return (
    <form onSubmit={onSubmit}>
      <Input type='text' placeholder='Auth code' value={code} onChange={e => setCode(e.target.value)} />
      <Button>Submit Code</Button>
      <p>{errorMessage}</p>
    </form>
  );
};
