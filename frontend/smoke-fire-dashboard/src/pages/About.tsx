import PageContainer from "../components/layout/PageContainer";
import Card from "../components/common/Card";
import readme from "../../../../README.md?raw";

export default function About() {
  return (
    <PageContainer title="About">
      <Card>
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
          {readme}
        </pre>
      </Card>
    </PageContainer>
  );
}