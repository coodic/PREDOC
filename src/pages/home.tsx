import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
} from "@ionic/react";

import {
  alertCircle,
  personCircle,
  calendar,
  fileTrayFull,
} from "ionicons/icons";
import { motion } from "framer-motion";
import "./home.css"; // Make sure to apply matching styles here

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>eMedic</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding home-content">
        <motion.div
          className="welcome-section"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="main-title">Welcome to eMedic</h1>
          <p className="subtitle-text">Your personalized health assistant</p>
        </motion.div>

        <IonGrid>
          <IonRow>
            {/* Health News Cards */}
            <IonCol size="12" size-md="6">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <IonCard className="gradient-card card-greenblue">
                  <IonCardHeader>
                    <IonCardTitle>COVID-19: What You Should Know</IonCardTitle>
                    <IonCardSubtitle>
                      Latest updates on coronavirus
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    Stay safe and informed with real-time COVID updates.
                  </IonCardContent>
                </IonCard>
              </motion.div>
            </IonCol>

            <IonCol size="12" size-md="6">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <IonCard className="gradient-card card-purpleblue">
                  <IonCardHeader>
                    <IonCardTitle>Heart Disease Prevention</IonCardTitle>
                    <IonCardSubtitle>How to reduce your risk</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    Adopt a heart-healthy lifestyle with our expert tips.
                  </IonCardContent>
                </IonCard>
              </motion.div>
            </IonCol>

            <IonCol size="12">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <IonCard className="gradient-card card-bluepink">
                  <IonCardHeader>
                    <IonCardTitle>Tips for Diabetes</IonCardTitle>
                    <IonCardSubtitle>
                      Managing blood sugar levels
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="diabetes-value">5.8</div>
                    Maintain a balanced diet and monitor regularly.
                  </IonCardContent>
                </IonCard>
              </motion.div>
            </IonCol>

            {/* Health Tip */}
            <IonCol size="12">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <IonCard className="gradient-card card-orange">
                  <IonCardHeader>
                    <IonCardTitle>Health Tip of the Day</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    Drink at least 8 glasses of water and walk 30 mins daily.
                  </IonCardContent>
                </IonCard>
              </motion.div>
            </IonCol>

            {/* Emergency Alert */}
            <IonCol size="12">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              >
                <IonCard className="gradient-card alert-gradient">
                  <IonCardHeader>
                    <IonCardTitle>
                      <IonIcon icon={alertCircle} color="light" /> Emergency
                      Alert
                    </IonCardTitle>
                    <IonCardSubtitle>
                      Seek help immediately if you feel dizzy.
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    Contact emergency services or visit the nearest hospital.
                  </IonCardContent>
                </IonCard>
              </motion.div>
            </IonCol>

            {/* Quick Links */}
            <IonCol size="12">
              <motion.div
                className="quick-links"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="section-title">Quick Links</h2>
                <div className="button-row">
                  <IonButton
                    className="gradient-button"
                    routerLink="/appointments"
                  >
                    <IonIcon icon={calendar} slot="start" />
                    Book Appointment
                  </IonButton>
                  <IonButton className="gradient-button" routerLink="/profile">
                    <IonIcon icon={personCircle} slot="start" />
                    My Profile
                  </IonButton>
                  <IonButton className="gradient-button" routerLink="/records">
                    <IonIcon icon={fileTrayFull} slot="start" />
                    Health Records
                  </IonButton>
                </div>
              </motion.div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
