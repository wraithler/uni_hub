FROM pytorch/pytorch:2.6.0-cuda12.6-cudnn9-runtime

WORKDIR /app

RUN pip install --upgrade pip
RUN pip install transformers[torch]
RUN pip install fastapi[standard] uvicorn

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]