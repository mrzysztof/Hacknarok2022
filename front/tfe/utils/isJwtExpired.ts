import decode from "jwt-decode";

export const isJwtExpired = (jwt: string): boolean => {
  try {
    // Define needed type by hand because jwt-decode lacks proper typing
    const decoded: { exp: number } = decode(jwt, { header: false });
    if (!decoded || !decoded.exp) return false;

    if (decoded.exp * 1000 <= new Date().getTime()) return false;

    return true;
  } catch (error) {
    return false;
  }
};