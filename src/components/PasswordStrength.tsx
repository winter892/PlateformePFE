
import React from "react";

// Password strength criteria
const hasLength = (password: string) => password.length >= 8;
const hasUppercase = (password: string) => /[A-Z]/.test(password);
const hasNumber = (password: string) => /[0-9]/.test(password);
const hasSpecialChar = (password: string) => /[^A-Za-z0-9]/.test(password);

export const calculatePasswordStrength = (password: string): "weak" | "medium" | "strong" => {
  if (!password) return "weak";
  
  let strength = 0;
  if (hasLength(password)) strength++;
  if (hasUppercase(password)) strength++;
  if (hasNumber(password)) strength++;
  if (hasSpecialChar(password)) strength++;
  
  if (strength <= 1) return "weak";
  if (strength <= 3) return "medium";
  return "strong";
};

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const strength = calculatePasswordStrength(password);
  
  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1 text-xs">
        <span>Sécurité du mot de passe:</span>
        <span className={`font-semibold ${
          strength === "weak" ? "text-red-500" : 
          strength === "medium" ? "text-yellow-500" : 
          "text-green-500"
        }`}>
          {strength === "weak" ? "Faible" : 
          strength === "medium" ? "Moyen" : 
          "Fort"}
        </span>
      </div>
      <div className="flex space-x-1 h-1">
        <div className={`w-1/3 rounded-l ${password ? "password-strength-" + strength : "bg-gray-200"}`}></div>
        <div className={`w-1/3 ${
          (strength === "medium" || strength === "strong") ? "password-strength-" + strength : "bg-gray-200"
        }`}></div>
        <div className={`w-1/3 rounded-r ${strength === "strong" ? "password-strength-strong" : "bg-gray-200"}`}></div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
        <div className={`flex items-center ${hasLength(password) ? "text-green-500" : ""}`}>
          <div className={`w-3 h-3 mr-1 rounded-full ${hasLength(password) ? "bg-green-500" : "bg-gray-300"}`}></div>
          8+ caractères
        </div>
        <div className={`flex items-center ${hasUppercase(password) ? "text-green-500" : ""}`}>
          <div className={`w-3 h-3 mr-1 rounded-full ${hasUppercase(password) ? "bg-green-500" : "bg-gray-300"}`}></div>
          Majuscule
        </div>
        <div className={`flex items-center ${hasNumber(password) ? "text-green-500" : ""}`}>
          <div className={`w-3 h-3 mr-1 rounded-full ${hasNumber(password) ? "bg-green-500" : "bg-gray-300"}`}></div>
          Chiffre
        </div>
        <div className={`flex items-center ${hasSpecialChar(password) ? "text-green-500" : ""}`}>
          <div className={`w-3 h-3 mr-1 rounded-full ${hasSpecialChar(password) ? "bg-green-500" : "bg-gray-300"}`}></div>
          Caractère spécial
        </div>
      </div>
    </div>
  );
};

export default PasswordStrength;
