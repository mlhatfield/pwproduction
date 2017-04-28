FROM ubuntu
USER root
RUN apt-get -y update
RUN apt-get update -y && apt-get install python-pip python-dev build-essential -y
RUN pip install --upgrade pip
RUN pip install flask
RUN pip install flask-login
RUN pip install pycrypto
RUN pip install sqlalchemy
RUN pip install awscli --ignore-installed six
RUN pip install boto3
RUN pip install apscheduler
RUN pip install tzlocal

COPY . /

CMD ["python", "run.py"]
