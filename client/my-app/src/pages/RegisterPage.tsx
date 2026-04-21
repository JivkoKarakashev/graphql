import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import styles from "./RegisterPage.module.css";
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import FormInput from "../components/FormInput.tsx";
import { registerSchema, type RegisterUser } from "../schemas/registerSchema.ts";

const RegisterPage = ({ onRegister }: { onRegister: (userData: RegisterUser) => Promise<void> }): React.ReactElement => {
  const navigate = useNavigate();


  const { register, handleSubmit, formState: { errors, isSubmitting, touchedFields }, watch, trigger } = useForm<RegisterUser>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur'
  });

  const password = watch('password');
  const rePassword = watch('rePassword');

  useEffect(() => {
    trigger('rePassword');
  }, [password, trigger]);

  const onSubmit = async (userData: RegisterUser) => {
    try {
      await new Promise((res) => setTimeout(res, 1500));
      console.log(userData);
      // await onRegister(userData);
      console.log('Successful registration!');
      // navigate('/');
    } catch (err) {
      alert("An error occurred on User's register!");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          type="email"
          placeholder="Email"
          icon={faEnvelope}
          register={register('email')}
          error={errors.email}
          isTouched={touchedFields.email}
        />

        <FormInput
          type="password"
          placeholder="Password"
          icon={faLock}
          register={register('password')}
          error={errors.password}
          isTouched={touchedFields.password}
        />

        <FormInput
          type="password"
          placeholder="Repeat Password"
          icon={faLock}
          register={register('rePassword')}
          error={errors.rePassword}
          isTouched={touchedFields.rePassword || !!rePassword}
        />

        <button className={`button is-link ${isSubmitting ? 'is-loading' : ''} `} disabled={isSubmitting} type='submit' >Submit</button>
      </form>
    </div>
  );
};

export default RegisterPage;