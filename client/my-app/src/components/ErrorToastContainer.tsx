import styles from './ErrorToastContainer.module.css';

import type { AppError } from "../context/error.tsx";

interface Props {
  errors: AppError[],
  onDismiss: (id: number) => void,
}

const ErrorToastContainer = ({ errors, onDismiss }: Props) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className={styles.error} >
      {errors.map(error => (
        <div
          key={error.id}
          className={`notification is-${error.type} is-light`}
          style={{ margin: 0 }}
        >
          <button
            className="delete"
            onClick={() => onDismiss(error.id)}
          />
          {error.message}
        </div>
      ))}
    </div>
  );
};

export default ErrorToastContainer;