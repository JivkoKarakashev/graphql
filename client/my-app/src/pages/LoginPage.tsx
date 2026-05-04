import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import styles from "./LoginPage.module.css";
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import { loginSchema, type LoginUser } from '../schemas/loginSchema.ts';
import FormInput from '../components/FormInput.tsx';
import { ErrorContext } from '../context/error.tsx';

const LoginPage = ({ onLogin }: { onLogin: (userData: LoginUser) => Promise<void> }): React.ReactElement => {
  const navigate = useNavigate();
  const { addError } = useContext(ErrorContext);

  const { register, handleSubmit, formState: { errors, isSubmitting, touchedFields, dirtyFields } } = useForm<LoginUser>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const onSubmit = async (userData: LoginUser) => {
    try {
      await new Promise((res) => setTimeout(res, 1500));
      console.log(userData);
      await onLogin(userData);
      console.log('Successful logged-in!');
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : "User's login failed!";
      addError(message);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label='Email'
          type='email'
          placeholder='Email'
          icon={faEnvelope}
          register={register('email')}
          error={errors.email}
          isTouched={touchedFields.email && dirtyFields.email}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="Password"
          icon={faLock}
          register={register('password')}
          error={errors.password}
          isTouched={touchedFields.password && dirtyFields.password}
        />

        <button className={`button is-link ${isSubmitting ? 'is-loading' : ''} `} disabled={isSubmitting} type='submit' >Submit</button>
      </form>
    </div>
  );
};

export default LoginPage;
