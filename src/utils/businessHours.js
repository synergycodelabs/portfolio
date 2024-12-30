const config = {
  timezone: 'America/New_York',
  hours: {
    start: 8,  // 8 AM
    end: 18,   // 6 PM
  },
  workDays: [1, 2, 3, 4, 5], // Monday through Friday
};

export const isBusinessHours = () => {
  const now = new Date();
  const options = { timeZone: config.timezone };
  const localTime = new Date(now.toLocaleString('en-US', options));
  
  const hour = localTime.getHours();
  const day = localTime.getDay();
  
  return config.workDays.includes(day) && 
         hour >= config.hours.start && 
         hour < config.hours.end;
};

export const getNextAvailableTime = () => {
  const now = new Date();
  const options = { timeZone: config.timezone };
  const localTime = new Date(now.toLocaleString('en-US', options));
  
  const nextDay = new Date(localTime);
  nextDay.setDate(localTime.getDate() + 1);
  nextDay.setHours(config.hours.start, 0, 0, 0);

  if (localTime.getDay() === 5 && localTime.getHours() >= config.hours.end) {
    // If it's Friday after business hours, next available is Monday
    nextDay.setDate(nextDay.getDate() + 2);
  } else if (localTime.getDay() === 6) {
    // If it's Saturday, next available is Monday
    nextDay.setDate(nextDay.getDate() + 1);
  }

  return nextDay.toLocaleString('en-US', {
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: config.timezone
  });
};

export const formatBusinessHours = () => {
  const formatTime = (hour) => {
    return new Date(2024, 0, 1, hour).toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: config.timezone
    });
  };

  return {
    start: formatTime(config.hours.start),
    end: formatTime(config.hours.end)
  };
};

export default {
  isBusinessHours,
  getNextAvailableTime,
  formatBusinessHours,
  config
};