
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthBarProps {
  password?: string;
}

const checkPasswordStrength = (password: string): { score: number; label: string } => {
  let score = 0;
  let label = 'Too short';

  if (password.length >= 8) {
    score += 1;
    label = 'Weak';
  }
  if (password.length >= 10 && /[A-Z]/.test(password)) {
    score += 1;
    label = 'Medium';
  }
  if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    score += 1;
    label = 'Strong';
  }
  if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
    score += 1;
    label = 'Very Strong';
  }
  if (password.length === 0) {
    score = 0;
    label = 'Too short';
  }

  return { score, label };
};

export function PasswordStrengthBar({ password = '' }: PasswordStrengthBarProps) {
  const { score, label } = checkPasswordStrength(password);

  const strengthColors = [
    'bg-destructive/70', // score 0 (or too short)
    'bg-destructive',     // score 1 (weak)
    'bg-yellow-500',      // score 2 (medium)
    'bg-lime-500',        // score 3 (strong)
    'bg-green-500',       // score 4 (very strong)
  ];

  const barWidth = password.length > 0 ? `${(score / 4) * 100}%` : '0%';

  return (
    <div className="mt-1">
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300 ease-in-out rounded-full",
            strengthColors[score]
          )}
          style={{ width: barWidth }}
        />
      </div>
      {password.length > 0 && (
        <p className="text-xs mt-1 text-right text-muted-foreground">
          Strength: {label}
        </p>
      )}
    </div>
  );
}
