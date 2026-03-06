export const MIDDLE_OF_THE_MONTH = 15;

export const orderDatesAndPutTimes = (dateCouple: (Date | undefined)[]) => {
  const [d1, d2] = dateCouple;
  const orderedSelectedDays = !d1 || !d2 ? dateCouple : [d1, d2].sort((d1, d2) => d1.getTime() - d2.getTime());

  const start = orderedSelectedDays[0] && new Date(orderedSelectedDays[0].getTime());
  const end = orderedSelectedDays[1] && new Date(orderedSelectedDays[1].getTime());

  start?.setHours(0, 0, 0, 0);
  end?.setHours(23, 59, 59, 999);

  return [start, end];
};
