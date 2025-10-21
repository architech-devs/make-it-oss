export const healthCheck = () => {
  return { status: 'ok', uptime: process.uptime() };
};
