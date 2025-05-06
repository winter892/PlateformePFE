
import React from 'react';

const generateStrongPassword = (length = 12): string => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  
  // Ensure at least one of each type
  let password = '';
  password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
  password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
  password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
  password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  
  // Fill the rest with random chars
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password characters
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

interface PasswordGeneratorProps {
  onGenerate: (password: string) => void;
  buttonColor?: string;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ 
  onGenerate,
  buttonColor = "bg-blue-500 hover:bg-blue-600"
}) => {
  const handleGenerateClick = () => {
    const newPassword = generateStrongPassword();
    onGenerate(newPassword);
  };

  return (
    <button
      type="button"
      onClick={handleGenerateClick}
      className={`text-xs ${buttonColor} text-white px-2 py-1 rounded`}
    >
      Générer
    </button>
  );
};

export default PasswordGenerator;
