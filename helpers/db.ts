import 'dotenv/config';
import { connect } from '@planetscale/database';

const PLANETSCALE_CONFIG = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD
};

export const PLANETSCALE_CONNECTION = connect(PLANETSCALE_CONFIG);
