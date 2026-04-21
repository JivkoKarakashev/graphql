import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const CheckIcon = (): React.ReactElement => {
  return (
    <span className="icon is-small is-right">
      <FontAwesomeIcon icon={faCircleCheck} />
    </span>
  );
};

export default CheckIcon;