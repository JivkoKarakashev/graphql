import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CheckIcon from './CheckIcon.tsx';
import Warning from './Warning.tsx';

type Props = {
  type: string;
  placeholder: string;
  icon: any;
  register: UseFormRegisterReturn;
  error?: FieldError;
  isTouched?: boolean;
};

const FormInput = ({ type, placeholder, icon, register, error, isTouched }: Props) => {
  return (
    <>
      <div className="field">
        <p className="control has-icons-left has-icons-right">
          <input className="input" type={type} placeholder={placeholder} {...register} />

          <span className="icon is-small is-left">
            <FontAwesomeIcon icon={icon} />
          </span>

          {isTouched && !error && <CheckIcon />}
        </p>
      </div>

      {error && <Warning message={error.message} />}
    </>
  );
};

export default FormInput;