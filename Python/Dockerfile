FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt /app

RUN pip install -r requirements.txt

RUN ipython kernel install --name "python3" --user

COPY . /app

ENTRYPOINT ["python3"]
CMD ["app.py"]