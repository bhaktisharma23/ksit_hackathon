from ultralytics import YOLO

def main():
    model = YOLO("yolov8n.pt")

    results = model.train(
        data="data.yaml",
        epochs=60,         
        imgsz=640,
        batch=8,           
        patience=15,        
        project="runs/detect",
        name="fire_smoke_train",
        pretrained=True,
        device="mps",         
        val=True,
        plots=True       
    )

    print("Training complete.")
    print(f"Best weights saved at: {results.save_dir}/weights/best.pt")

if __name__ == "__main__":
    main()