import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import styles from "./LoginPage.module.css";
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import { loginSchema, type LoginUser } from '../schemas/loginSchema.ts';
import FormInput from '../components/FormInput.tsx';

const LoginPage = ({ onLogin }: { onLogin: (userData: LoginUser) => Promise<void> }): React.ReactElement => {
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors, isSubmitting, touchedFields } } = useForm<LoginUser>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const email = useWatch({ control, name: 'email' });
  const password = useWatch({ control, name: 'password' });

  const onSubmit = async (userData: LoginUser) => {
    try {
      await new Promise((res) => setTimeout(res, 1500));
      console.log(userData);
      // await onLogin(userData);
      console.log('Successful logged-in!');
      // navigate('/');
    } catch (err) {
      console.log(JSON.stringify(err));
      alert("An error occurred on User's login!");
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
          isTouched={touchedFields.email}
          value={email}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="Password"
          icon={faLock}
          register={register('password')}
          error={errors.password}
          isTouched={touchedFields.password}
          value={password}
        />

        <button className={`button is-link ${isSubmitting ? 'is-loading' : ''} `} disabled={isSubmitting} type='submit' >Submit</button>
      </form>
    </div>
  );
};

export default LoginPage;
