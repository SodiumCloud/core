export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiration: process.env.JWT_SECRET || '7d',
};
