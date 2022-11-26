# Knowledge Sharing Platform 🗒
Knowledge sharing platform application aims to get the students acquainted with the courses, professors, evaluation schemes. The said things can be achieved via gathering course feedback, professor feedback, and previous year grading schemes. This can be done by making a portal (just like a blog site) where people can share their honest reviews without being scrutinized much. Getting reviews from mass makes it easy for one to choose the particular course and get the right information about that course. Crowd-sourcing of materials and feedback would make it easy to organize resources at one place. It would be more reliable, save one’s time and avoid unnecessary bothering. Moreover, students can also get relevant course resources from the students who already opted for the course. This platform can also act as a general guidance portal.

## Techstack 👩‍💻
Django, ReactJS, AWS-S3

## Maintainers ☀️
[@Ananyaiitbhilai](https://github.com/Ananyaiitbhilai) 

## Other details 📑
This project is in its secomd iteration. We might have NodeJS as backend. In future, might do clustering of students on the basis of the course taken.

## Contribution Guidelines ✨
Please go through the Wiki. The success of our vision to bring knowledge to every single hand depends on you. Even a small contribution helps. All forms of contributions are highly welcomed and valued.
- [How to create a PR?](https://github.com/OpenLake/Knowledge-Sharing-Platform/wiki/PR-Format-Guidelines)
- [PR Format Guidelines](https://github.com/OpenLake/Knowledge-Sharing-Platform/wiki/How-to-create-a-PR?)

## Set-up the project 💻

### Install the virtual env
`sudo apt install -y python3-venv `

### Create the virtual env.
`python3 -m venv <env name>`

### Activate your virtual environment
`source <env_name>/bin/activate`

### Install the dependencies for backend
`pip install django djangorestframework django-cors-headers`

### Install the requirements
`pip install -r requirements.txt`

### Apply migrations
`python manage.py migrate`

### Run the backend server:
`python manage.py runserver`

Open a new terminal and do the following:

### Navigate to the frontend folder
`cd ksp`

### Install the dependencies for frontend
`npm install`

#### Run the frontend server
`npm start`

We have to parallely run frontend and backend servers.
