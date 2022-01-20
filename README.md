### Install the virtual env
`sudo apt install -y python3-venv activate`

### Create the virtual env.
`python3 -m venv <env name>`

### Activate your virtual environment
`source <env_name>/bin/activate`

### Install the dependencies for backend
`pip install django djangorestframework django-cors-headers`

### Apply migrations
`python manage.py migrate`

### Run the backend server:
`python manage.py runserver`

Open a new terminal and do the following:

### Navigate to the frontend folder
`cd ksp_frontend`

### Install the dependencies for frontend
`npm install`

#### Run the frontend server
`npm start`

We have to parallely run frontend and backend servers.