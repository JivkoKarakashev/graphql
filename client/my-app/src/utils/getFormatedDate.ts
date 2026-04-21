const dateTimeFormatOpts: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
};

const getFormatedDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', dateTimeFormatOpts);
};

export {
  getFormatedDate
}