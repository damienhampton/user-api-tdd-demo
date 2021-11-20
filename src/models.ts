export type RegistrationDetails = {
  username: string,
  password: string,
  about: string,
}

export type UserResponse = {
  id: string,
  username: string,
}

export type LoginDetails = {
  username: string,
  password: string,
}

export type LoginResponse = {
  token: string,
}

export type User = {
  id: string,
  username: string,
  password: string,
  about: string,
}

export type UserSession = {
  userId: string,
  token: string,
}