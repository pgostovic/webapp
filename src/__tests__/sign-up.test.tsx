import { cleanup, fireEvent, render, waitForElement } from '@testing-library/react';
import 'jest-dom/extend-expect';
import React from 'react';
import { WebappClient } from '../client';
import { SERVER_CONFIG, setupServer, tearDownServer } from '../lib/test-helper';

describe('Sign-up', () => {
  beforeEach(async () => {
    history.replaceState({}, 'Sign up', '/sign-up');
    await setupServer();
  });

  afterEach(async () => {
    cleanup();
    await tearDownServer();
  });

  describe('click [Sign Up] button with empty form', () => {
    it('should display Invalid email address', async () => {
      const result = render(
        <WebappClient server={SERVER_CONFIG}>
          <h1 data-testid='the-client'>The Client</h1>
        </WebappClient>,
      );

      await waitForElement(() => result.getByTestId('auth-status-known'));

      const signUpButton = result.getByTestId('sign-up-button');
      fireEvent.click(signUpButton);

      const errorMessage = await waitForElement(() => result.getByTestId('error-message'));

      expect(errorMessage).toHaveTextContent('TEST:services.createAccount.invalidEmailAddress');
      expect(result.queryByTestId('the-client')).not.toBeInTheDocument();
    });
  });

  // describe('sign in with existing account', () => {
  //   it('should redirect to path /', async () => {
  //     const result = render(
  //       <WebappClient server={SERVER_CONFIG}>
  //         <h1 data-testid='the-client'>The Client</h1>
  //       </WebappClient>,
  //     );

  //     await waitForElement(() => result.getByTestId('auth-status-known'));

  //     const emailInput = result.getByTestId('email');
  //     const passwordInput = result.getByTestId('password');
  //     const signInButton = result.getByTestId('sign-in-button');

  //     fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
  //     fireEvent.change(passwordInput, { target: { value: 'abcd1234' } });
  //     fireEvent.click(signInButton);

  //     await waitForDomChange(result);

  //     expect(location.pathname).toBe('/');

  //     expect(result.queryByTestId('the-client')).toBeInTheDocument();
  //   });
  // });

  // describe('sign in with existing account, wrong password', () => {
  //   it('should display Invalid Credentials', async () => {
  //     const result = render(
  //       <WebappClient server={SERVER_CONFIG}>
  //         <h1 data-testid='the-client'>The Client</h1>
  //       </WebappClient>,
  //     );

  //     await waitForElement(() => result.getByTestId('auth-status-known'));

  //     const emailInput = result.getByTestId('email');
  //     const passwordInput = result.getByTestId('password');
  //     const signInButton = result.getByTestId('sign-in-button');

  //     fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
  //     fireEvent.change(passwordInput, { target: { value: 'wrong' } });
  //     fireEvent.click(signInButton);

  //     const errorMessage = await waitForElement(() => result.getByTestId('error-message'));
  //     expect(errorMessage).toHaveTextContent('Invalid credentials');
  //     expect(result.queryByTestId('the-client')).not.toBeInTheDocument();
  //   });
  // });
});
