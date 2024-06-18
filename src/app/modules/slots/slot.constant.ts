export const generateSlots = (
  startTime: string,
  endTime: string,
  slotDuration: number,
) => {
  const start = new Date(`1999-01-01T${startTime}:00Z`);
  const end = new Date(`1999-01-01T${endTime}:00Z`);

  const totalSlotDuration = (end.getTime() - start.getTime()) / (1000 * 60);

  const numberOfSlots = Math.floor(totalSlotDuration / slotDuration);

  const slots = [];

  for (let i = 0; i < numberOfSlots; i++) {
    const slotStartTime = new Date(start.getTime() + i * slotDuration * 60000);

    const slotEndTime = new Date(
      slotStartTime.getTime() + slotDuration * 60000,
    );

    slots.push({
      startTime: slotStartTime.toISOString().substring(11, 16),
      endTime: slotEndTime.toISOString().substring(11, 16),
    });
  }

  return slots;
};
