export interface RegistrationInput {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export interface RegistrationErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export function validateRegistration(input: RegistrationInput): RegistrationErrors {
  const errors: RegistrationErrors = {}
  if (!input.fullName.trim()) errors.fullName = 'Enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) errors.email = 'Enter a valid email address.'
  if (input.password.length < 8) errors.password = 'Use at least 8 characters.'
  if (input.password !== input.confirmPassword) errors.confirmPassword = 'Passwords do not match.'
  return errors
}
