import path from 'path';
import { google } from 'googleapis';
const pathToCredFile = path.resolve(__dirname, '..', '..', '..', 'service_account.json');
const auth = new google.auth.GoogleAuth({
  keyFile: pathToCredFile,
  scopes: ['https://www.googleapis.com/auth/drive'],
});
google.options({ auth });

export default google;
