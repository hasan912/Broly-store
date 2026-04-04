const fallbackAdminEmail = 'admin@brolycaps.com';
const fallbackAdminPassword = 'BrolyCaps@2026';

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL ?? fallbackAdminEmail,
    password: process.env.ADMIN_PASSWORD ?? fallbackAdminPassword,
  };
}

export function validateAdminCredentials(email: string, password: string) {
  const adminCredentials = getAdminCredentials();

  return (
    email.trim().toLowerCase() === adminCredentials.email.trim().toLowerCase() &&
    password === adminCredentials.password
  );
}
