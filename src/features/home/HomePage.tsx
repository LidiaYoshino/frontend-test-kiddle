import { format } from "date-fns";
import { RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ResponsiveGrid } from "../../components/common/layout/ResponsiveGrid";
import { Section } from "../../components/common/layout/Section";
import { Stack } from "../../components/common/layout/Stack";
import { Card } from "../../components/ui/Card";
import { UserAvatar } from "../../components/ui/UserAvatar";
import { Button } from "../../components/ui/Button";
import { getErrorMessage } from "../../lib/api/client";
import { getApiStatus } from "./api/getApiStatus";
import type { ApiStatusResponse } from "../../types/api";

export function HomePage() {
  const [payload, setPayload] = useState<ApiStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getApiStatus();
      setPayload(data);
      setLastUpdatedAt(new Date());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  return (
    <Section>
      <Stack className="gap-6">
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar name="Frontend Candidate" />
            <div>
              <h1 className="text-xl font-semibold sm:text-2xl">Frontend Test Starter</h1>
              <p className="text-sm text-slate-600">Responsive no-SSR base with your required libraries.</p>
            </div>
          </div>
          <Button type="button" onClick={() => void fetchStatus()} disabled={isLoading} className="w-full sm:w-auto">
            <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Loading..." : "Refresh API"}
          </Button>
        </Card>

        <ResponsiveGrid>
          <Card>
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">API Base URL</h2>
            <p className="break-all text-sm text-slate-700">https://kiddle-code-challenge-0b5750a3aba2.herokuapp.com/</p>
          </Card>
          <Card>
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">Status</h2>
            <p className="text-sm text-slate-700">{error ? "Request failed" : "Ready"}</p>
          </Card>
          <Card>
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">Last Updated</h2>
            <p className="text-sm text-slate-700">
              {lastUpdatedAt ? format(lastUpdatedAt, "dd/MM/yyyy HH:mm:ss") : "No successful request yet"}
            </p>
          </Card>
        </ResponsiveGrid>

        <Card>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-500">Response Preview</h2>
          {error ? (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
          ) : payload ? (
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
              {JSON.stringify(payload, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-slate-600">Loading initial response...</p>
          )}
        </Card>
      </Stack>
    </Section>
  );
}
