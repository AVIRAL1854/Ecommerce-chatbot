# 🛍️ E-commerce Chatbot

A powerful AI-powered chatbot built for e-commerce websites, featuring a React.js frontend and a Django backend. The chatbot integrates the Gemini API to answer customer queries and stores data in a PostgreSQL database.

---

## 🌟 Features

- AI-Powered Responses: Leveraging Gemini API for smart query handling
- Frontend: Built with React.js and styled using Tailwind CSS
- Backend: Powered by Django and REST framework
- JWT Authentication: Secure user authentication
- Database: PostgreSQL for robust data storage
- Environment-Friendly: Organized .env management for configurations

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## 📂 Folder Structure

```
Ecommerce Chatbot
├── backend
│   ├── api
│   ├── storefront
│   ├── .env.example
│   ├── manage.py
│   ├── db.sqlite3
│   ├── Pipfile
│   ├── Pipfile.lock
├── frontend
│   ├── public
│   ├── src
│   ├── .env
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── package.json
│   ├── tsconfig.json
```

---

## 🚀 Getting Started

Follow the steps below to set up the project locally:

---

### 🔧 Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   Ensure you have pipenv installed:
   ```bash
   pip install pipenv
   ```
   Then, install the required packages:
   ```bash
   pipenv install
   ```

3. Activate the virtual environment:
   ```bash
   pipenv shell
   ```

4. Set up environment variables:
   - Rename .env.example to .env:
     ```bash
     mv .env.example .env
     ```
   - Edit the .env file to include your configurations:
     ```env
     GEMINI_API_KEY=
     #paste gemini api key here
     ```

5. Apply migrations:
   ```bash
   python manage.py migrate
   ```

6. Run the backend server:
   ```bash
   python manage.py runserver
   ```
   Visit http://127.0.0.1:8000 to verify the backend is running.

---

### 🎨 Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a .env file in the frontend directory:
     ```env
     VITE_BACKEND_URL=http://127.0.0.1:8000
     GEMINI_API_KEY=
     #paste gemini api key here
     ```

4. Run the frontend development server:
   ```bash
   npm run dev
   ```
   Visit http://127.0.0.1:5173 to view the application.

---

## 🔗 Connecting Frontend and Backend

Ensure the API calls in your React frontend are correctly pointing to the Django backend. Update the VITE_BACKEND_URL in the .env file as needed.

---

## 🧪 Testing

- Backend APIs: Test API endpoints using tools like Postman or cURL
- Frontend: Verify UI and API interactions by visiting the frontend development server

---

## 🐛 Common Issues and Fixes

### Backend Issues
- Database Errors: Ensure migrations are applied, and the db.sqlite3 file is present
- Dependency Errors: Run pipenv install again to ensure all packages are installed
- Gemini API Issues: Verify your API key is correctly set in the .env file

### Frontend Issues
- CORS Issues: Ensure django-cors-headers is installed and configured in Django:
  ```python
  INSTALLED_APPS += ['corsheaders']
  MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware'] + MIDDLEWARE
  CORS_ALLOW_ALL_ORIGINS = True
  ```

---

## 🛡️ Production Deployment

### Backend
1. Switch to a production database like PostgreSQL
2. Use a WSGI server (e.g., Gunicorn) for deployment
3. Configure static file serving
4. Secure your Gemini API key in production

### Frontend
1. Build the React app:
   ```bash
   npm run build
   ```
2. Serve the dist/ folder using a web server like Nginx or Vercel

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository, make changes, and submit a pull request.

---

## ✨ Acknowledgments

Special thanks to:
- [Django Documentation](https://docs.djangoproject.com)
- [React Documentation](https://reactjs.org)
- [Google Gemini API](https://ai.google.dev/docs)

---

## 🔐 API Key Security

Remember to:
- Never commit your Gemini API key to version control
- Use environment variables for sensitive data
- Implement proper key rotation and management in production
- Consider using secret management services in production

---

🎉 Happy Coding!
