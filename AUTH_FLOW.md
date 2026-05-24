# Auth Flow API Handoff

This document explains how the frontend should integrate with the current NestJS auth API.

## Base URL

Local development:

```text
http://localhost:3000/api/v1
```

Set this in the frontend as an environment variable, for example:

```text
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Current Behavior

- Users register with `name`, `email`, and `password`.
- Users log in with `email` and `password`.
- Registration returns an access token immediately.
- Login is allowed even if the email is not verified.
- After registration, the backend creates a verification token and tries to send a verification email.
- Forgot password sends a 6-digit OTP to the user's email.
- OTP verification returns a short-lived reset token used to set a new password.
- If SMTP is not configured, the backend logs the verification link in the server terminal.
- Email verification is non-blocking and should be treated as an account status feature, not a login requirement.

## Auth Token

The backend returns a JWT access token:

```json
{
  "accessToken": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "Priya",
    "email": "priya@example.com",
    "isEmailVerified": false
  }
}
```

Frontend should send the token on protected requests:

```text
Authorization: Bearer JWT_TOKEN
```

Recommended frontend handling:

- Store `accessToken` after register/login.
- Attach it to protected API requests.
- Store the returned `user` object in app auth state.
- Use `isEmailVerified` to show a soft prompt/banner if needed.
- Do not block logged-in access based on `isEmailVerified`.

## Endpoints

## Health Check

Use this to check if the backend is running.

```http
GET /health
```

Full URL:

```text
http://localhost:3000/api/v1/health
```

Example response:

```json
{
  "status": "ok"
}
```

## Register

Creates a new user account and returns an auth token.

```http
POST /auth/register
```

Full URL:

```text
http://localhost:3000/api/v1/auth/register
```

Headers:

```text
Content-Type: application/json
```

Request body:

```json
{
  "name": "Priya",
  "email": "priya@example.com",
  "password": "secret123"
}
```

Validation rules:

- `name`: required string, minimum 2 characters
- `email`: required valid email
- `password`: required string, minimum 6 characters

Success response:

```json
{
  "accessToken": "JWT_TOKEN",
  "user": {
    "id": "6651f7a0b7f4c8d001234567",
    "name": "Priya",
    "email": "priya@example.com",
    "isEmailVerified": false
  }
}
```

Common error responses:

```json
{
  "message": "Email is already registered",
  "error": "Conflict",
  "statusCode": 409
}
```

```json
{
  "message": [
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

Frontend behavior:

- On success, save `accessToken`.
- Save `user` in auth state.
- Redirect user into the app or onboarding flow.
- Optionally show a message like: `We sent a verification email. You can continue using the app.`

## Login

Logs in an existing user.

```http
POST /auth/login
```

Full URL:

```text
http://localhost:3000/api/v1/auth/login
```

Headers:

```text
Content-Type: application/json
```

Request body:

```json
{
  "email": "priya@example.com",
  "password": "secret123"
}
```

Success response:

```json
{
  "accessToken": "JWT_TOKEN",
  "user": {
    "id": "6651f7a0b7f4c8d001234567",
    "name": "Priya",
    "email": "priya@example.com",
    "isEmailVerified": false
  }
}
```

Common error response:

```json
{
  "message": "Invalid email or password",
  "error": "Unauthorized",
  "statusCode": 401
}
```

Frontend behavior:

- On success, save `accessToken`.
- Save `user` in auth state.
- Redirect user into the authenticated app.
- If `user.isEmailVerified` is false, show a non-blocking reminder only.

## Current User

Returns the currently authenticated user.

```http
GET /auth/me
```

Full URL:

```text
http://localhost:3000/api/v1/auth/me
```

Headers:

```text
Authorization: Bearer JWT_TOKEN
```

Success response:

```json
{
  "id": "6651f7a0b7f4c8d001234567",
  "name": "Priya",
  "email": "priya@example.com",
  "isEmailVerified": false
}
```

Common error response:

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

Frontend behavior:

- Call this when the app loads and a token already exists.
- If it succeeds, restore the user session.
- If it returns `401`, clear the saved token and send the user to login.

## Verify Email

Verifies a user's email address using the token from the verification link.

```http
GET /auth/verify-email?token=TOKEN
```

Full URL example:

```text
http://localhost:3000/api/v1/auth/verify-email?token=abc123
```

Success response:

```json
{
  "verified": true
}
```

Common error response:

```json
{
  "message": "Invalid or expired verification token",
  "error": "Bad Request",
  "statusCode": 400
}
```

Frontend behavior:

- Create a route/page for email verification if desired, for example `/verify-email?token=...`.
- Read the token from the URL.
- Call the backend verify endpoint.
- Show success or expired/invalid token state.
- If the user is currently logged in, refresh `/auth/me` after successful verification.

## Forgot Password

Starts the password reset flow by sending a 6-digit OTP to the user's email.

```http
POST /auth/forgot-password
```

Full URL:

```text
http://localhost:3000/api/v1/auth/forgot-password
```

Headers:

```text
Content-Type: application/json
```

Request body:

```json
{
  "email": "priya@example.com"
}
```

Success response:

```json
{
  "message": "If an account exists for this email, a password reset OTP has been sent."
}
```

Frontend behavior:

- Show the same success message regardless of whether the email exists.
- Navigate the user to the OTP entry screen.
- In local development, if SMTP is not configured, the OTP is printed in the backend terminal.

## Verify Password Reset OTP

Verifies the OTP and returns a reset token.

```http
POST /auth/verify-password-reset-otp
```

Full URL:

```text
http://localhost:3000/api/v1/auth/verify-password-reset-otp
```

Headers:

```text
Content-Type: application/json
```

Request body:

```json
{
  "email": "priya@example.com",
  "otp": "123456"
}
```

Success response:

```json
{
  "resetToken": "RESET_TOKEN"
}
```

Common error response:

```json
{
  "message": "Invalid or expired OTP",
  "error": "Bad Request",
  "statusCode": 400
}
```

Frontend behavior:

- Save `resetToken` temporarily in component state or memory.
- Do not save `resetToken` as a long-lived auth token.
- Move the user to the new-password screen.
- OTP expires after 10 minutes.

## Reset Password

Sets a new password after OTP verification.

```http
POST /auth/reset-password
```

Full URL:

```text
http://localhost:3000/api/v1/auth/reset-password
```

Headers:

```text
Content-Type: application/json
```

Request body:

```json
{
  "email": "priya@example.com",
  "resetToken": "RESET_TOKEN",
  "password": "newSecret123"
}
```

Success response:

```json
{
  "reset": true
}
```

Common error response:

```json
{
  "message": "Invalid or expired reset token",
  "error": "Bad Request",
  "statusCode": 400
}
```

Frontend behavior:

- On success, clear the reset token from state.
- Redirect the user to login.
- Ask the user to log in with the new password.
- Reset token expires after 10 minutes.

## Suggested Frontend Auth State

The frontend auth store can keep:

```ts
type AuthUser = {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
};

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
```

## Suggested API Helper

Example using `fetch`:

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function apiRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  return data;
}
```

Register:

```ts
const result = await apiRequest('/auth/register', {
  method: 'POST',
  body: JSON.stringify({
    name,
    email,
    password,
  }),
});

localStorage.setItem('accessToken', result.accessToken);
```

Login:

```ts
const result = await apiRequest('/auth/login', {
  method: 'POST',
  body: JSON.stringify({
    email,
    password,
  }),
});

localStorage.setItem('accessToken', result.accessToken);
```

Restore session:

```ts
const user = await apiRequest('/auth/me');
```

Verify email:

```ts
await apiRequest(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
  method: 'GET',
});
```

Forgot password:

```ts
await apiRequest('/auth/forgot-password', {
  method: 'POST',
  body: JSON.stringify({
    email,
  }),
});
```

Verify reset OTP:

```ts
const result = await apiRequest('/auth/verify-password-reset-otp', {
  method: 'POST',
  body: JSON.stringify({
    email,
    otp,
  }),
});

const resetToken = result.resetToken;
```

Reset password:

```ts
await apiRequest('/auth/reset-password', {
  method: 'POST',
  body: JSON.stringify({
    email,
    resetToken,
    password,
  }),
});
```

## Important Notes For Frontend

- Login does not require verified email.
- Registration automatically attempts to send a verification email.
- There is no resend verification endpoint yet.
- Forgot-password flow exists using email OTP.
- There is no refresh-token endpoint yet.
- JWT expiry is controlled by backend `JWT_EXPIRES_IN`.
- If the token expires, `/auth/me` will return `401`.
- The frontend should treat `401` as session expired and clear local auth state.
