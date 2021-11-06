import React, { useEffect, useState } from "react";

import { observer } from "mobx-react-lite";
import { Button, Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityList from "./ActivityList";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";
import { PagingParams } from "../../../app/models/pagination";

const ActivityDashboard = () => {
  const { activityStore } = useStore();
  const {
    loadActivities,
    activityRegistry,
    loadingInitial,
    setPagingParams,
    pagination,
  } = activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadActivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    if (activityRegistry.size <= 1) loadActivities();
  }, [activityRegistry.size, loadActivities]);

  if (loadingInitial && !loadingNext)
    return <LoadingComponent content="Loading activities..." />;

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList />
        <Button
          float="rignt"
          content="More..."
          positive
          onClick={handleGetNext}
          loading={loadingNext}
          disabled={pagination?.totalPages === pagination?.currentPage}
        />
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
