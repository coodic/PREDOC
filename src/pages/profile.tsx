import React, { useState, useRef } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonToggle,
  IonIcon,
  IonInput,
  IonButton,
  IonList,
  IonTextarea,
} from "@ionic/react";
import { chevronForward, pencil } from "ionicons/icons";
import defaultProfileImage from "../assets/images/default.png"; // Import default profile image
import "./profile.css";

const ProfilePage: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    age: "30",
    gender: "Male",
    healthHistory: ["Cough"],
    profileImage: defaultProfileImage, // Use default image initially
  });
  const [tempUserInfo, setTempUserInfo] = useState({ ...userInfo });
  const [newHealthEntry, setNewHealthEntry] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setUserInfo({ ...tempUserInfo });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (key: string, value: string) => {
    setTempUserInfo({ ...tempUserInfo, [key]: value });
  };

  const handleHealthEntryAdd = () => {
    if (newHealthEntry.trim()) {
      setTempUserInfo({
        ...tempUserInfo,
        healthHistory: [...tempUserInfo.healthHistory, newHealthEntry.trim()],
      });
      setNewHealthEntry("");
    }
  };

  const handleHealthEntryRemove = (index: number) => {
    const updatedHistory = tempUserInfo.healthHistory.filter(
      (_, i) => i !== index
    );
    setTempUserInfo({ ...tempUserInfo, healthHistory: updatedHistory });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempUserInfo({ ...tempUserInfo, profileImage: imageUrl });
      // In a real app, upload the file to your backend/storage service (e.g., Firebase Storage).
      // Example pseudo-code:
      // const uploadedImageUrl = await uploadImageToStorage(file);
      // setTempUserInfo({ ...tempUserInfo, profileImage: uploadedImageUrl });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="header-toolbar">
          <IonTitle>eMedic</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className="profile-header">
          <div
            className="profile-icon"
            style={{ backgroundImage: `url(${tempUserInfo.profileImage})` }}
            onClick={isEditing ? triggerFileInput : undefined}
          >
            {isEditing && (
              <div className="edit-overlay">
                <IonIcon icon={pencil} />
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <div className="profile-info">
            {isEditing ? (
              <>
                <IonInput
                  value={tempUserInfo.name}
                  onIonChange={(e) =>
                    handleInputChange("name", e.detail.value!)
                  }
                  className="profile-name-input"
                />
                <IonInput
                  value={tempUserInfo.email}
                  onIonChange={(e) =>
                    handleInputChange("email", e.detail.value!)
                  }
                  className="profile-email-input"
                />
              </>
            ) : (
              <>
                <h2 className="profile-name">{userInfo.name}</h2>
                <p className="profile-email">{userInfo.email}</p>
              </>
            )}
          </div>
        </div>

        <div className="user-details">
          {isEditing ? (
            <>
              <IonInput
                value={tempUserInfo.age}
                onIonChange={(e) => handleInputChange("age", e.detail.value!)}
                className="detail-item-input"
                placeholder="Age"
              />
              <IonInput
                value={tempUserInfo.gender}
                onIonChange={(e) =>
                  handleInputChange("gender", e.detail.value!)
                }
                className="detail-item-input"
                placeholder="Gender"
              />
            </>
          ) : (
            <>
              <span className="detail-item">Age: {userInfo.age}</span>
              <span className="detail-item">Gender: {userInfo.gender}</span>
            </>
          )}
        </div>

        <IonCard className="health-history-card">
          <IonCardHeader>
            <IonCardTitle className="section-title">
              Health History
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {isEditing ? (
              <>
                <IonList>
                  {tempUserInfo.healthHistory.map((entry, index) => (
                    <IonItem key={index}>
                      <IonLabel>{entry}</IonLabel>
                      <IonButton
                        fill="clear"
                        onClick={() => handleHealthEntryRemove(index)}
                      >
                        Remove
                      </IonButton>
                    </IonItem>
                  ))}
                </IonList>
                <div className="health-entry-input">
                  <IonTextarea
                    value={newHealthEntry}
                    onIonChange={(e) => setNewHealthEntry(e.detail.value!)}
                    placeholder="Add new health entry"
                  />
                  <IonButton onClick={handleHealthEntryAdd}>Add</IonButton>
                </div>
              </>
            ) : (
              userInfo.healthHistory.map((entry, index) => (
                <p key={index} className="history-item">
                  {entry}
                </p>
              ))
            )}
          </IonCardContent>
        </IonCard>

        <IonCard className="settings-card">
          <IonCardHeader>
            <IonCardTitle className="section-title">Settings</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem lines="none" className="settings-item">
              <IonLabel>Notifications</IonLabel>
              <IonToggle
                checked={notificationsEnabled}
                onIonChange={handleNotificationsToggle}
                color="primary"
              />
            </IonItem>
            <IonItem
              lines="none"
              className="settings-item"
              button
              detail={false}
              routerLink="/help-support"
            >
              <IonLabel>Help & Support</IonLabel>
              <IonIcon icon={chevronForward} slot="end" />
            </IonItem>
            <IonItem lines="none" className="settings-item">
              <IonButton expand="block" onClick={handleEditToggle}>
                {isEditing ? "Save" : "Edit Profile"}
              </IonButton>
            </IonItem>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
