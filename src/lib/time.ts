export const parseDuration = (durationStr: string) => {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) return;
  if (match.length !== 3) return;

  const num = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "ms":
      return num;
    case "s":
      return num * 1000;
    case "m":
      return num * 60 * 1000;
    case "h":
      return num * 60 * 60 * 1000;
    default:
      return;
  }
};
