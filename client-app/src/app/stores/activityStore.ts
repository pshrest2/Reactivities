import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { store } from "./store";

class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loadingInitial = false;
  submitting = false;
  deleting = false;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, "dd MMM yyyy");
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
        this.setActivity(activity);
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        this.setSelectedActivity(activity);
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  private setActivity = (activity: Activity) => {
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees!.some(
        (a) => a.username === user.username
      );

      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees!.find(
        (x) => x.username === activity.hostUsername
      );
    }
    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  createActivity = async (activity: Activity) => {
    this.submitting = true;
    try {
      activity.id = uuid();
      await agent.Activities.create(activity);
      this.setActivity(activity);
      this.setSelectedActivity(activity);
      this.setEditMode(false);
      this.setSubmitting(false);
    } catch (error) {
      console.log(error);
      this.setSubmitting(false);
    }
  };

  updateActivity = async (activity: Activity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      this.setActivity(activity);
      this.setSelectedActivity(activity);
      this.setEditMode(false);
      this.setSubmitting(false);
    } catch (error) {
      console.log(error);
      this.setSubmitting(false);
    }
  };

  private setSelectedActivity = (activity: Activity) => {
    this.selectedActivity = activity;
  };

  setEditMode = (editMode: boolean) => {
    this.editMode = editMode;
  };

  setSubmitting = (submitting: boolean) => {
    this.submitting = submitting;
  };

  deleteActivity = async (id: string) => {
    this.deleting = true;
    try {
      await agent.Activities.delete(id);
      this.removeActivity(id);
      this.setDeleting(false);
    } catch (error) {
      console.log(error);
      this.setDeleting(false);
    }
  };

  removeActivity = (id: string) => {
    this.activityRegistry.delete(id);
  };

  setDeleting = (deleting: boolean) => {
    this.deleting = deleting;
  };
}

export default ActivityStore;
