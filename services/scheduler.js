const weeklyStatsService = require('./weeklyStatsSerrvice');

const TEST_MODE = 0;

function initializeScheduler() {
  if (TEST_MODE) {
    console.log('Starting scheduler in TEST MODE');
    
    const intervalId = setInterval(async () => {
      try {
        await weeklyStatsService.generateWeeklyStats();
      } catch (err) {
        console.error('Weekly stats task failed:', err);
      }
    }, 60000);
    
    global._statsInterval = intervalId;
  } else {
    console.log('Starting scheduler');
    
    const task = async () => {
      try {
        await weeklyStatsService.generateWeeklyStats();
      } catch (err) {
        console.error('Weekly stats task failed:', err);
      }
      
      scheduleNextSunday();
    };
    
    const scheduleNextSunday = () => {
      const now = new Date();
      const nextSunday = new Date();
      
      nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
      nextSunday.setHours(0, 0, 0, 0);
      
      if (nextSunday <= now) {
        nextSunday.setDate(nextSunday.getDate() + 7);
      }
      
      const timeUntilNextSunday = nextSunday.getTime() - now.getTime();
      const maxTimeout = 2147483647;

      const days = Math.floor(timeUntilNextSunday / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeUntilNextSunday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilNextSunday % (1000 * 60 * 60)) / (1000 * 60));
      
      console.log(`Next stats run scheduled on Sunday at midnight (in ${days} days, ${hours} hours, ${minutes} minutes)`);
      
      if (timeUntilNextSunday > maxTimeout) {
        const timeoutId = setTimeout(() => {
          scheduleNextSunday();
        }, maxTimeout);
        
        global._statsTimeout = timeoutId;
      } else {
        const timeoutId = setTimeout(() => {
          task();
        }, timeUntilNextSunday);
        
        global._statsTimeout = timeoutId;
      }
    };
    
    scheduleNextSunday();
  }
}

module.exports = {
  initializeScheduler
};