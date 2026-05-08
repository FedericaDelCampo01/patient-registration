# Patient Registration

Full-stack patient registration application built with Laravel 13 (API) and React 18 (frontend), containerised with Docker Compose.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 13, PHP 8.4 |
| Database | PostgreSQL 16 |
| Queue | Laravel Queue — database driver |
| Frontend | React 18, TypeScript, Vite |
| Infrastructure | Docker Compose, Nginx |
| Email (dev) | Mailtrap sandbox |

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose

## Getting Started

```bash
# 1. Copy the environment file
cp backend/.env.example backend/.env

# 2. Add your Mailtrap credentials to backend/.env
#    MAIL_USERNAME and MAIL_PASSWORD from your Mailtrap inbox

# 3. Start all services
docker compose up --build

# 4. In a separate terminal — generate key, run migrations, and link storage
docker compose exec php php artisan key:generate
docker compose exec php php artisan migrate
docker compose exec php php artisan storage:link
```

| Service | URL |
|---------|-----|
| API | http://localhost/api/v1 |
| Frontend | http://localhost:5173 |

## API Reference

### Register a patient

```
POST /api/v1/patients
Content-Type: multipart/form-data
```

| Field | Type | Rules |
|-------|------|-------|
| `full_name` | string | required, letters and spaces only |
| `email` | string | required, valid email, unique |
| `country_code` | string | required, format `+X` to `+XXXX` (e.g. `+1`, `+598`) |
| `phone_number` | string | required, 6–15 digits |
| `document_photo` | file | required, JPG only, max 10 MB |

**201 Created**
```json
{
  "id": 1,
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "country_code": "+1",
  "phone_number": "5551234567",
  "full_phone": "+15551234567",
  "document_photo_url": "http://localhost/storage/documents/abc123.jpg",
  "created_at": "2024-01-01T00:00:00.000000Z"
}
```

**422 Unprocessable Entity** — returned on validation failure, with field-level error messages.

### List patients

```
GET /api/v1/patients
```

Returns an array of all registered patients ordered by most recent first.

## Running Tests

Tests run inside the `php` container against an in-memory SQLite database:

```bash
docker compose exec php php artisan test
```

## Email Notifications

After a successful registration, a confirmation email is dispatched asynchronously via the `queue` service. The queue worker runs as a dedicated Docker service so the API response is never blocked.

In development, emails are captured by [Mailtrap](https://mailtrap.io/). Set your inbox credentials in `backend/.env`:

```env
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
```

## SMS Notifications (planned)

The notification system is built on Laravel's channel architecture (`app/Notifications/PatientRegistered.php`). Adding SMS requires installing a provider package (e.g. Vonage or Twilio) and extending the `via()` method — no structural changes needed:

```php
public function via(object $notifiable): array
{
    return ['mail', 'vonage'];
}
```
