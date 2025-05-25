import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { FacebookAuthService } from '../services/facebook-auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {  constructor(
    private readonly configService: ConfigService,
    private readonly facebookAuthService: FacebookAuthService,
  ) {
    // Make sure we have non-undefined values for required properties
    const clientID = configService.get<string>('FACEBOOK_APP_ID') || '';
    const clientSecret = configService.get<string>('FACEBOOK_APP_SECRET') || '';
    const callbackURL = configService.get<string>('FACEBOOK_CALLBACK_URL') || 'http://localhost:3001/api/facebook/auth/callback';
    
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: [
        'email',
        'pages_read_engagement',
        'pages_read_user_content',
        'pages_manage_metadata',
        'pages_manage_posts',
        'pages_messaging',
        'business_management',
      ],
      profileFields: [
        'id',
        'displayName',
        'name',
        'emails',
        'picture.type(large)',
      ],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ): Promise<any> {
    try {
      // Extract user information from Facebook profile
      const facebookUser = {
        facebookId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value || null,
        profilePicture: profile.photos?.[0]?.value || null,
        accessToken,
        refreshToken,
        profile,
      };

      // The actual user linking will be handled in the controller
      // This strategy is mainly for OAuth flow validation
      done(null, facebookUser);
    } catch (error) {
      done(error, null);
    }
  }
}
