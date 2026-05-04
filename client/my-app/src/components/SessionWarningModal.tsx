import styles from './SessionWarningModal.module.css';

interface Props {
  isOpen: boolean;
  secondsRemaining: number;
  onContinue: () => void;
  onLogout: () => void;
}

const SessionWarningModal = ({ isOpen, secondsRemaining, onContinue, onLogout, }: Props): React.ReactElement => {
  if (!isOpen) {
    return null;
  }

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const countdown = minutes > 0
    ? `${minutes}:${String(seconds).padStart(2, '0')}`
    : `${secondsRemaining}s`;

  const isUrgent = secondsRemaining <= 30;

  return (
    <div className={`modal is-active ${styles.overlay}`}>
      <div className="modal-background" onClick={onLogout} />

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            <span className="icon-text">
              <span className="icon has-text-warning">
                <i className="fas fa-clock" />
              </span>
              <span>Session Expiring</span>
            </span>
          </p>
        </header>

        <section className="modal-card-body">
          <p className="mb-4">
            Your session is about to expire due to inactivity. Would you like to continue?
          </p>

          <div className="notification is-warning is-light">
            <p className="has-text-centered">
              <span className="is-size-6">Time remaining</span>
              <br />
              <span
                className={`is-size-2 has-text-weight-bold ${isUrgent ? 'has-text-danger' : 'has-text-warning-dark'
                  }`}
              >
                {countdown}
              </span>
            </p>
          </div>

          {isUrgent && (
            <p className="help has-text-danger has-text-centered mt-2">
              You will be logged out automatically when the timer reaches zero.
            </p>
          )}
        </section>

        <footer className="modal-card-foot is-justify-content-flex-end">
          <button
            className="button is-light mr-2"
            onClick={onLogout}
          >
            Log out now
          </button>
          <button
            className="button is-link"
            onClick={onContinue}
          >
            <span className="icon">
              <i className="fas fa-rotate-right" />
            </span>
            <span>Continue session</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SessionWarningModal;