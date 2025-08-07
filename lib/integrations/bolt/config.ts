import { BoltCredentials } from './types';
import { BoltAuthService } from './auth';

export function configureBoltAPI() {
  const clientId = process.env.BOLT_CLIENT_ID;
  const clientSecret = process.env.BOLT_CLIENT_SECRET;

  console.log('Configuring Bolt API:', {
    clientIdExists: !!clientId,
    clientSecretExists: !!clientSecret,
    clientIdLength: clientId?.length,
    clientSecretLength: clientSecret?.length,
  });

  if (!clientId || !clientSecret) {
    console.warn('Bolt API credentials not found in environment variables');
    return;
  }

  const credentials: BoltCredentials = {
    clientId,
    clientSecret,
  };

  const authService = BoltAuthService.getInstance();
  authService.setCredentials(credentials);
  console.log('Bolt API credentials configured successfully');
}

export function isBoltConfigured(): boolean {
  return !!(process.env.BOLT_CLIENT_ID && process.env.BOLT_CLIENT_SECRET);
}