import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile;
}

const ProfilePhotos = ({ profile }: Props) => {
  const {
    profileStore: {
      isCurrentUser,
      uploadPhoto,
      uploading,
      loading,
      setMainPhoto,
      deletePhoto,
    },
  } = useStore();
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState("");

  const handlePhotoUpload = (file: Blob) => {
    uploadPhoto(file).then(() => setAddPhotoMode(false));
  };

  const handleSetMainPhoto = (
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
  };

  const handleDeletePhoto = (
    id: string,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(e.currentTarget.name);
    deletePhoto(id);
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header icon="image" content="Photos" floated="left" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handlePhotoUpload}
              loading={uploading}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile.photos?.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                  {isCurrentUser && (
                    <Button.Group fluid width={2}>
                      <Button
                        basic
                        color="green"
                        content="Main"
                        name={photo.id}
                        disabled={photo.isMain}
                        loading={target === photo.id && loading}
                        onClick={(e) => handleSetMainPhoto(photo, e)}
                      />
                      <Button
                        basic
                        loading={target === `${photo.id}-delete` && loading}
                        name={`${photo.id}-delete`}
                        color="red"
                        icon="trash"
                        onClick={(e) => handleDeletePhoto(photo.id, e)}
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
