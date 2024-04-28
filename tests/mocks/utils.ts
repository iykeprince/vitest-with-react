import { delay, http, HttpResponse } from "msw";
import { server } from "./server";
import { User } from "../../src/entities";
import { useAuth0 } from "@auth0/auth0-react";

export const simulateDelay = (endpoint: string) => {
    server.use(
        http.get(endpoint, async () => {
          await delay();
          return HttpResponse.json([]);
        })
      );
  
}

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
}

export const mockAuthState = (authState: AuthState) => {
  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    getAccessTokenSilently: vi.fn().mockResolvedValue('a'),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithRedirect: vi.fn(),
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn()
  })
}