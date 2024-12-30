export const chatConfig = {
  businessHours: {
    timezone: 'America/New_York',
    start: 8, // 8 AM
    end: 18,  // 6 PM
    workDays: [1, 2, 3, 4, 5], // Monday through Friday
  },
  statusMessages: {
    checking: { text: 'Connecting...', color: 'text-yellow-500' },
    offline: { text: 'Service Unavailable', color: 'text-red-500' },
    outsideHours: { text: 'Outside Business Hours', color: 'text-orange-500' },
    online: { text: 'Online', color: 'text-green-500' }
  }
};
