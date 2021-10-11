import React, { ChangeEvent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Segment, Label } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { useHistory, useParams } from "react-router";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";

const ActivityForm = () => {
  const history = useHistory();
  const { activityStore } = useStore();
  const {
    submitting,
    createActivity,
    updateActivity,
    loadActivity,
    loadingInitial,
  } = activityStore;
  const { id } = useParams<{ id: string }>();

  const [activity, setActivity] = useState({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });

  const validationSchema = Yup.object({
    title: Yup.string().required("The activity title is required"),
    description: Yup.string().required("The activity description is required"),
    category: Yup.string().required(),
    date: Yup.string().required(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(activity!));
  }, [id, loadActivity]);

  // const handleSubmit = () => {
  //   if (activity.id.length === 0) {
  //     let newActivity = {
  //       ...activity,
  //       id: uuid(),
  //     };
  //     createActivity(newActivity).then(() => {
  //       history.push(`/activities/${newActivity.id}`);
  //     });
  //   } else {
  //     updateActivity(activity).then(() => {
  //       history.push(`/activities/${activity.id}`);
  //     });
  //   }
  // };

  // const handleChange = (
  //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = event.target;
  //   setActivity({ ...activity, [name]: value });
  // };

  if (loadingInitial) return <LoadingComponent content="Loading Activity..." />;

  return (
    <Segment clearing>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => console.log(values)}
      >
        {({ handleSubmit }: any) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput placeholder="Title" name="title" />
            <MyTextInput placeholder="Description" name="description" />
            <MyTextInput placeholder="Category" name="category" />
            <MyTextInput placeholder="Date" name="date" />
            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />
            <Button
              floated="right"
              positive
              type="submit"
              content="Submit"
              loading={submitting}
            />
            <Button
              as={Link}
              to="/activities"
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default observer(ActivityForm);
