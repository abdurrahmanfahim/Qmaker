# QMaker Backend API

Backend API for the Question Paper Builder application.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qmaker
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

3. Start the server:
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Papers
- `GET /api/papers` - Get all papers for user
- `GET /api/papers/:id` - Get single paper
- `POST /api/papers` - Create new paper
- `PUT /api/papers/:id` - Update paper
- `DELETE /api/papers/:id` - Delete paper

### Templates
- `GET /api/templates` - Get question templates
- `GET /api/templates/:id` - Get single template

### Health Check
- `GET /api/health` - Server health status

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Data Structure

### Paper Object
```json
{
  "id": "string",
  "userId": "string",
  "metadata": {
    "examName": "string",
    "schoolName": "string",
    "className": "string",
    "subject": "string",
    "language": "string"
  },
  "sections": [
    {
      "id": "string",
      "title": "string",
      "subQuestions": [
        {
          "id": "string",
          "content": "string",
          "marks": "number",
          "label": "string"
        }
      ]
    }
  ],
  "createdAt": "date",
  "updatedAt": "date"
}
```