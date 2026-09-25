from ultralytics import YOLO

model = YOLO("models/best.pt")
metrics = model.val(data="data.yaml")

print(f"mAP50: {metrics.box.map50}")
print(f"mAP50-95: {metrics.box.map}")
print(f"Precision: {metrics.box.p}")
print(f"Recall: {metrics.box.r}")