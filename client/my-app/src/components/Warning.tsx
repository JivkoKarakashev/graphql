const Warning = ({ message }: { message: string }): React.ReactElement => {
  return (
    <div className="notification is-warning">
      {message}
    </div>
  );
};

export default Warning;