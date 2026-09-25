from collections import defaultdict

from backend.config import CLASS_NAMES


def compute_metrics(inference_results: list) -> dict:
    confidence_sums = defaultdict(float)
    detection_counts = defaultdict(int)

    for frame_result in inference_results:
        for det in frame_result["detections"]:
            class_name = det["class_name"]
            confidence_sums[class_name] += det["confidence"]
            detection_counts[class_name] += 1

    average_confidence = {}
    for class_name in CLASS_NAMES:
        count = detection_counts.get(class_name, 0)
        average_confidence[class_name] = (
            round(confidence_sums[class_name] / count, 4) if count > 0 else 0.0
        )

    total_detections = sum(detection_counts.values())
    frames_with_detection = sum(1 for r in inference_results if len(r["detections"]) > 0)

    return {
        "average_confidence_per_class": average_confidence,
        "detection_counts_per_class": {c: detection_counts.get(c, 0) for c in CLASS_NAMES},
        "total_detections": total_detections,
        "total_frames_processed": len(inference_results),
        "frames_with_detection": frames_with_detection,
    }