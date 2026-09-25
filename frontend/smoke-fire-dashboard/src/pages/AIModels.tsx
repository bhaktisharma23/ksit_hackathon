import { useState, useEffect } from "react";
import { Cpu } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Loader from "../components/common/Loader";
import { getModels } from "../services/modelService";
import type { AIModel } from "../types/model";

export default function AIModels() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModels().then((data) => {
      setModels(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <PageContainer title="AI Models">
        <Loader label="Loading models..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="AI Models">
      <div className="grid grid-cols-2 gap-4">
        {models.map((model) => (
          <Card key={model.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cpu size={18} className="text-gray-400" />
                <h3 className="font-semibold text-gray-900">{model.name}</h3>
              </div>
              <Badge tone={model.status === "active" ? "success" : "neutral"}>
                {model.status.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-gray-500">Version</span>
              <span className="text-gray-900 font-medium">{model.version}</span>

              <span className="text-gray-500">Framework</span>
              <span className="text-gray-900 font-medium">{model.framework}</span>

              <span className="text-gray-500">Classes</span>
              <span className="text-gray-900 font-medium">{model.classes.join(", ")}</span>

              <span className="text-gray-500">Accuracy</span>
              <span className="text-gray-900 font-medium">{(model.metrics.accuracy * 100).toFixed(1)}%</span>

              <span className="text-gray-500">Precision</span>
              <span className="text-gray-900 font-medium">{(model.metrics.precision * 100).toFixed(1)}%</span>

              <span className="text-gray-500">Recall</span>
              <span className="text-gray-900 font-medium">{(model.metrics.recall * 100).toFixed(1)}%</span>

              <span className="text-gray-500">mAP</span>
              <span className="text-gray-900 font-medium">{(model.metrics.mAP * 100).toFixed(1)}%</span>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}