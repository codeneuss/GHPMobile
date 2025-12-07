// GitHub OAuth Device Flow
// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#device-flow

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface AccessTokenError {
  error: string;
  error_description: string;
}

// Public Client ID - Dies muss durch deine eigene OAuth App ersetzt werden
// Erstelle eine unter: https://github.com/settings/developers
const CLIENT_ID = 'Ov23liJcQWLvHdlbF8gj';

export class GitHubOAuth {
  private static readonly DEVICE_CODE_URL = 'https://github.com/login/device/code';
  private static readonly ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';

  static async requestDeviceCode(): Promise<DeviceCodeResponse> {
    const response = await fetch(this.DEVICE_CODE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        scope: 'repo project read:org read:user',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to request device code');
    }

    return response.json();
  }

  static async pollForAccessToken(
    deviceCode: string,
    interval: number,
    onProgress?: () => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const poll = setInterval(async () => {
        try {
          onProgress?.();

          const response = await fetch(this.ACCESS_TOKEN_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              client_id: CLIENT_ID,
              device_code: deviceCode,
              grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
            }),
          });

          const data: AccessTokenResponse | AccessTokenError = await response.json();

          if ('access_token' in data) {
            clearInterval(poll);
            resolve(data.access_token);
          } else if (data.error === 'authorization_pending') {
            // Continue polling
          } else if (data.error === 'slow_down') {
            // Increase interval - but we'll keep it simple for now
          } else if (data.error === 'expired_token') {
            clearInterval(poll);
            reject(new Error('Autorisierung abgelaufen. Bitte versuche es erneut.'));
          } else if (data.error === 'access_denied') {
            clearInterval(poll);
            reject(new Error('Zugriff verweigert.'));
          } else {
            clearInterval(poll);
            reject(new Error(data.error_description || 'Unbekannter Fehler'));
          }
        } catch (error) {
          clearInterval(poll);
          reject(error);
        }
      }, interval * 1000);

      // Timeout after 15 minutes
      setTimeout(() => {
        clearInterval(poll);
        reject(new Error('Autorisierung abgelaufen. Bitte versuche es erneut.'));
      }, 15 * 60 * 1000);
    });
  }
}
