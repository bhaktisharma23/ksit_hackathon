import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { API_BASE_URL } from "../utils/constants";

export default function Settings() {
  const [detectionThreshold, setDetectionThreshold] = useState(0.35);
  const [alertThreshold, setAlertThreshold] = useState(0.7);

  return (
    <PageContainer title="System Settings">
      <div className="grid grid-cols-2 gap-4 max-w-3xl">
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">API Configuration</h3>
          <p className="text-sm text-gray-500">Base URL</p>
          <p className="text-sm font-mono text-gray-900 mt-1">{API_BASE_URL}</p>
          <p className="text-xs text-gray-400 mt-2">Configured via environment variables, not editable here.</p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Detection Threshold</h3>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={detectionThreshold}
            onChange={(e) => setDetectionThreshold(Number(e.target.value))}
            className="w-full accent-fire"
          />
          <p className="text-sm text-gray-900 mt-1">{(detectionThreshold * 100).toFixed(0)}%</p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Alert Threshold</h3>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(Number(e.target.value))}
            className="w-full accent-fire"
          />
          <p className="text-sm text-gray-900 mt-1">{(alertThreshold * 100).toFixed(0)}%</p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Notifications</h3>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" defaultChecked className="accent-fire" />
            Email alerts on new fire detection
          </label>
        </Card>
      </div>

      <Button variant="primary" className="mt-4">
        Save Settings
      </Button>
    </PageContainer>
  );
}