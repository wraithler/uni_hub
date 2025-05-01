import torch
import torch.nn.functional as F
from transformers import BertTokenizer, BertForSequenceClassification

tokenizer = BertTokenizer.from_pretrained('fzn0x/bert-spam-classification-model')
model = BertForSequenceClassification.from_pretrained('fzn0x/bert-spam-classification-model')

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()


def model_predict(text: str):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True).to(device)
    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits

    probs = F.softmax(logits, dim=1)
    prediction = torch.argmax(logits, dim=1).item()
    confidence = probs[0][prediction].item()

    return {
        "spam": bool(prediction),
        "confidence": confidence,
    }