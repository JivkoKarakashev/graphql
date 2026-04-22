import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

import CheckIcon from './CheckIcon.tsx';
import XmarkIcon from './XmarkIcon.tsx';
import Warning from './Warning.tsx';

type Props = {
  label: string,
  type: string,
  placeholder: string,
  icon: IconDefinition,
  register: UseFormRegisterReturn,
  error?: FieldError,
  isTouched?: boolean,
  value?: string
};

const FormInput = ({ label, type, placeholder, icon, register, error, isTouched, value }: Props) => {
  return (
    <>
      <div className="field">
        <label className="label">{label}</label>
        <p className="control has-icons-left has-icons-right">
          <input className="input" type={type} placeholder={placeholder} {...register} />

          <span className="icon is-small is-left">
            <FontAwesomeIcon icon={icon} />
          </span>
          {isTouched && value?.trim().length > 0 && (
            !error
              ? <CheckIcon />
              : <XmarkIcon />
          )}
        </p>
      </div>

      {error && <Warning message={error.message} />}
    </>
  );
};

export default FormInput;