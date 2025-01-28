# Cybersecurity Analysis Project




<img width="120" alt="image" src="https://github.com/user-attachments/assets/492668ab-4e50-4b86-80c8-e83f0e4079ec" />





## Overview
This project provides a simple Node.js web application designed to simulate a small-scale task management system. The application has intentional issues to serve as a learning platform for analyzing security vulnerabilities and application stability.

Your task is to examine the provided code, identify vulnerabilities, and propose improvements to enhance security and reliability.

## Application Features
- **User Registration and Login**: Users can register with a username and password, and log in to access protected features.
- **Task Management**: Authenticated users can add, view, and delete tasks.
- **Session Management**: The application uses session middleware to manage user sessions.
- **Static File Serving**: 
  - Unprotected files (`login.html`, `register.html`) are served from the `public` folder.
  - Protected files (`index.html`, `dashboard.html`) are served from the `private/protected` folder and require authentication.

## Structure
- **Public Routes**:
  - `POST /register`: Register a new user.
  - `POST /login`: Authenticate an existing user.
  - `GET /public/login.html`: Serve the login page.
  - `GET /public/register.html`: Serve the registration page.
- **Protected Routes**:
  - `GET /`: Redirect to the dashboard or login based on session status.
  - `GET /dashboard`: Serve the dashboard page for authenticated users.
  - `POST /add`: Add a task for the logged-in user.
  - `GET /tasks`: Retrieve tasks for the logged-in user.
  - `DELETE /tasks/:id`: Delete a task by ID.
  - `GET /logout`: Log out the current user.

## Your Task
1. **Analyze the Code**:
   - Review the codebase provided in the repository.
   - Identify all security vulnerabilities and areas where errors are not handled properly.

2. **Develop Static Files**:
   - Create the necessary HTML files for the `public` and `private/protected` folders:
     - `login.html`: A user-friendly login page.
     - `register.html`: A registration page with a form.
     - `index.html`: The main dashboard page for logged-in users.
     - `dashboard.html`: A page for managing tasks.
   - The dashboard should include two sections:
     - **Add Task Section**: A form to add new tasks.
     - **Task Display Section**: A table that lists all tasks retrieved from the server.
   - Use modern CSS to create a visually appealing layout and user experience.
   - Implement functionality using only vanilla JavaScript, the Fetch API, and DOM manipulation.

3. **Document Vulnerabilities and Errors**:
   - For each issue, explain the potential impact and suggest a solution to mitigate the problem.

4. **Submit a Report**:
   - Your report should include:
     - A list of identified vulnerabilities.
     - A list of unhandled error scenarios.
     - Proposed solutions for each issue.

## Deliverables
- The final project, including all developed files and the implemented functionalities.
- A detailed report of vulnerabilities and error scenarios.
- Developed static files (html and js) with well-designed layouts and CSS.
- A functional dashboard with task addition and display sections implemented using vanilla JavaScript.

## Notes
- This project is intentionally insecure. Do not deploy it in a production environment.
- Focus on analysis and understanding rather than implementing fixes immediately.

Good luck!

