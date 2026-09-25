import PageContainer from "../components/layout/PageContainer";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import AlertFilters from "../components/alerts/AlertFilters";
import AlertTable from "../components/alerts/AlertTable";
import { useAlerts } from "../hooks/useAlerts";

export default function AlertLogs() {
  const { alerts, filters, setFilters, state, changeStatus } = useAlerts();

  return (
    <PageContainer title="Alert Logs">
      <Card>
        <AlertFilters filters={filters} onChange={setFilters} />
        {state === "loading" ? <Loader label="Loading alerts..." /> : <AlertTable alerts={alerts} onStatusChange={changeStatus} />}
      </Card>
    </PageContainer>
  );
}