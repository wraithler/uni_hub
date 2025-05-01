from fastapi import FastAPI
from pydantic import BaseModel

import inference

app = FastAPI()


class RequestBody(BaseModel):
    text: str


@app.post("/check-spam/")
async def check_spam(body: RequestBody):
    try:
        prediction = inference.model_predict(body.text)
        return prediction
    except:
        return {"message": "Something went wrong, please try again."}
