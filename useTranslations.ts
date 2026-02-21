
import { premiumBusinesses } from './premium_businesses';
import { directoryBusinesses } from './directory_businesses';
import { Business } from '../types';

export const businesses: Business[] = [
  ...premiumBusinesses,
  ...directoryBusinesses
];
