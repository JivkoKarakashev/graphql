import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import styles from "./RegisterPage.module.css";
import { faCircleUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import FormInput from "../components/FormInput.tsx";
import { registerSchema, type RegisterUser } from "../schemas/registerSchema.ts";

const RegisterPage = ({ onRegister }: { onRegister: (userData: RegisterUser) => Promise<void> }): React.ReactElement => {
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors, isSubmitting, touchedFields }, trigger } = useForm<RegisterUser>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const username = useWatch({ control, name: 'username' });
  const email = useWatch({ control, name: 'email' });
  const password = useWatch({ control, name: 'password' });
  const rePassword = useWatch({ control, name: 'rePassword' });

  useEffect(() => {
    if (password) {
      trigger('rePassword');
    }
  }, [password, trigger]);

  const onSubmit = async (userData: RegisterUser) => {
    try {
      await new Promise((res) => setTimeout(res, 1500));
      console.log(userData);
      // await onRegister(userData);
      console.log('Successful registration!');
      // navigate('/');
    } catch (err) {
      console.log(JSON.stringify(err));
      alert("An error occurred on User's register!");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label='Username'
          type='text'
          placeholder='Username'
          icon={faCircleUser}
          register={register('username')}
          error={errors.username}
          isTouched={touchedFields.username}
          value={username}
        />

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
          label='Password'
          type='password'
          placeholder='Password'
          icon={faLock}
          register={register('password')}
          error={errors.password}
          isTouched={touchedFields.password}
          value={password}
        />

        <FormInput
          label='Repeat Password'
          type='password'
          placeholder='Repeat Password'
          icon={faLock}
          register={register('rePassword')}
          error={errors.rePassword}
          isTouched={touchedFields.rePassword}
          value={rePassword}
        />

        <button className={`button is-link ${isSubmitting ? 'is-loading' : ''} `} disabled={isSubmitting} type='submit' >Submit</button>
      </form>
    </div>
  );
};

export default RegisterPage;