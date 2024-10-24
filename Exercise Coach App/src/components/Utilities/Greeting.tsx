// greeting.ts
export const getGreeting = (): string => {
    const currentHour = new Date().getHours();
    let greeting;
  
    if (currentHour < 5) {
      greeting = 'Good Evening 🌙'; // From midnight to 4 AM
    } else if (currentHour < 12) {
      greeting = 'Good Morning ☀️'; // From 5 AM to 11 AM
    } else if (currentHour < 18) {
      greeting = 'Good Afternoon 🌤️'; // From 12 PM to 5 PM
    } else {
      greeting = 'Good Evening 🌆'; // From 6 PM to 11 PM
    }
  
    return greeting;
  };
  