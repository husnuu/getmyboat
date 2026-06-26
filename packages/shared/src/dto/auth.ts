import type { ProfileRole } from "../enums";

export interface AuthUserDTO {
  id: string;
  email: string;
  fullName: string | null;
  role: ProfileRole;
}

/** Public auth response — refresh token is set via httpOnly cookie (BFF), not in body. */
export interface AuthResponseDTO {
  accessToken: string;
  user: AuthUserDTO;
}

/** Internal: backend → BFF only (refresh token never sent to browser JS). */
export interface AuthSessionDTO extends AuthResponseDTO {
  refreshToken: string;
}

export interface SignupRequestDTO {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
}
