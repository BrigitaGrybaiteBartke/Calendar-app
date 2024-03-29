# Calendar App

This is a simple calendar application built with React and TypeScript. It allows users to manage tasks by date, providing day and week views for better organization. The application implements CRUD (Create, Read, Update, Delete) functionality and uses json-server to simulate a backend for mock data storage.

### Features

* __Day Page:__ View and manage tasks for a specific day.

* __Week Page:__ Plan and organize tasks for the entire week.

* __Create Task:__ Easily create new tasks with details like task description, date, and time.

* __Update Task:__ Modify existing tasks, including the ability to update date and time.

* __Delete Task:__ Remove tasks that are no longer needed.

* __Mock Data with json-server:__ Utilizes json-server to provide mock data for development and testing purposes.


### Additional Functionality

* __Real-time Task Updates:__ Upon creating a new task, the task appears automatically at the chosen time and date within the calendar.
  
* __Drag and Drop Functionality:__ In the day view, tasks can be moved to different times, while in the week view, tasks can be moved to different times or dates, all through drag and drop interactions.
  

### Technologies Used
* __React:__ A JavaScript library for building user interfaces.
* __TypeScript:__ Typed superset of JavaScript that compiles to plain JavaScript.
* __json-server:__ A full fake REST API server for development and testing.

### Getting Started
Follow these instructions to get the Calendar App up and running on your local machine.

#### Installation
Clone the repository to your local machine:
```
git clone https://github.com/BrigitaGrybaiteBartke/Calendar-app.git
```
Navigate to the project directory:
```
cd calendar-app
```
Install dependencies: 
``` 
npm install
```

#### Running the Application
To start the development server and json-server for mock data, run the following command:
``` 
npm run start-with-server
```

This will start both the React application and the json-server concurrently.

Access the application in your browser at [http://localhost:3000](http://localhost:3000).

