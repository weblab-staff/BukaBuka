import path from 'path';
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: path.resolve(__dirname, '..', 'service_account.json'),
  scopes: ['https://www.googleapis.com/auth/drive'],
});
google.options({ auth });

export default google;
