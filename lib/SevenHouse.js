export const SevenHours = (dateString) => {
    return dateString
      ? new Date(new Date(dateString).getTime() + 7 * 60 * 60 * 1000)
      : null;
  };