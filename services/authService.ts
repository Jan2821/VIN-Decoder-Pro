
export const checkCredentials = (username: string, password: string): boolean => {
  // Hier können Sie weitere Benutzer hinzufügen
  // Format: 'benutzername': 'passwort'
  const validUsers: Record<string, string> = {
    'admin': '1741', // Passwort aktualisiert wie gewünscht
    'gast': 'vin2024',
    'user': 'user123'
  };

  const normalizedUser = username.trim().toLowerCase();
  return validUsers[normalizedUser] === password;
};
