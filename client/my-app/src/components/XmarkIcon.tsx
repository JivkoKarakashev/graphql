import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const XmarkIcon = (): React.ReactElement => {
  return (
    <span className="icon is-small is-right has-text-warning">
      <FontAwesomeIcon icon={faCircleXmark} />
    </span>
  );
};

export default XmarkIcon;