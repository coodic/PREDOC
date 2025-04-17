import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonCheckbox,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
} from "@ionic/react";

import "./AIDoctor.css";

// Define the symptom relevance mapping (same as Flask API)
const SYMPTOM_RELEVANCE: { [key: string]: string[] } = {
  Malaria: [
    "fever",
    "chills",
    "sweats",
    "headache",
    "nausea",
    "vomiting",
    "body_aches",
    "impaired_consciousness",
    "prostration",
    "convulsions",
    "deep_breathing",
    "respiratory_distress",
    "abnormal_bleeding",
    "jaundice",
    "severe_anemia",
  ],
  Dengue: [
    "fever",
    "headache",
    "body_aches",
    "rash",
    "nausea",
    "vomiting",
    "abnormal_bleeding",
  ],
  Typhoid: [
    "fever",
    "weakness",
    "abdominal_pain",
    "headache",
    "diarrhea",
    "rash",
  ],
};

interface Diagnosis {
  selectedDisease: string;
  recommendedDrug: string;
  tabletsPerDay: number;
  dosage: string;
  tip: string;
  adjustment_message?: string;
}

interface FetchError extends Error {
  message: string;
}

const AIDoctorPage: React.FC = () => {
  const [selectedDisease, setSelectedDisease] = useState<string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<{
    [key: string]: boolean;
  }>({
    fever: false,
    chills: false,
    sweats: false,
    headache: false,
    nausea: false,
    vomiting: false,
    body_aches: false,
    impaired_consciousness: false,
    prostration: false,
    convulsions: false,
    deep_breathing: false,
    respiratory_distress: false,
    abnormal_bleeding: false,
    jaundice: false,
    severe_anemia: false,
    rash: false,
    abdominal_pain: false,
    weakness: false,
    diarrhea: false,
  });
  const [patientDetails, setPatientDetails] = useState({
    age: "",
    weight: "",
    region: "Sub-Saharan Africa",
    gender: "Male",
    pregnant: false,
    g6pd_deficiency: false,
    previous_medications: false,
  });
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get symptoms based on selected disease
  const getSymptomsForDisease = (disease: string): string[] => {
    if (!disease || !SYMPTOM_RELEVANCE[disease]) return [];
    return SYMPTOM_RELEVANCE[disease].map((symptom) =>
      symptom
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  const symptomsList = getSymptomsForDisease(selectedDisease);

  const handleSymptomToggle = (symptom: string) => {
    const symptomKey = symptom.toLowerCase().replace(" ", "_");
    setSelectedSymptoms((prev) => ({
      ...prev,
      [symptomKey]: !prev[symptomKey],
    }));
  };

  const handlePatientDetailChange = (key: string, value: string | boolean) => {
    setPatientDetails({
      ...patientDetails,
      [key]: value,
    });
  };

  const handleDiseaseChange = (disease: string) => {
    setSelectedDisease(disease);
    // Reset symptoms when disease changes
    setSelectedSymptoms({
      fever: false,
      chills: false,
      sweats: false,
      headache: false,
      nausea: false,
      vomiting: false,
      body_aches: false,
      impaired_consciousness: false,
      prostration: false,
      convulsions: false,
      deep_breathing: false,
      respiratory_distress: false,
      abnormal_bleeding: false,
      jaundice: false,
      severe_anemia: false,
      rash: false,
      abdominal_pain: false,
      weakness: false,
      diarrhea: false,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setDiagnosis(null);

    // Prepare data to send to the API
    const symptomData = {
      disease: selectedDisease,
      ...Object.fromEntries(
        Object.entries(selectedSymptoms).map(([key, value]) => [
          key,
          value ? 1 : 0,
        ])
      ),
      age: parseInt(patientDetails.age) || 0,
      weight: parseInt(patientDetails.weight) || 0,
      region: patientDetails.region,
      gender: patientDetails.gender,
      pregnant: patientDetails.pregnant ? 1 : 0,
      g6pd_deficiency: patientDetails.g6pd_deficiency ? 1 : 0,
      previous_medications: patientDetails.previous_medications ? 1 : 0,
    };

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(symptomData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch diagnosis");
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setDiagnosis({
        selectedDisease: result.selectedDisease || "Unknown",
        recommendedDrug: result.recommendedDrug || "Not specified",
        tabletsPerDay: result.tabletsPerDay || 0,
        dosage: result.dosage || "Not specified",
        tip:
          result.tip || "Consult a healthcare provider for a proper diagnosis.",
        adjustment_message: result.adjustment_message,
      });
    } catch (err) {
      const fetchError = err as FetchError;
      setError(
        fetchError.message || "An error occurred while fetching the diagnosis"
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      selectedDisease &&
      Object.values(selectedSymptoms).some((val) => val) &&
      patientDetails.age &&
      parseInt(patientDetails.age) > 0 &&
      parseInt(patientDetails.age) <= 120 &&
      patientDetails.weight &&
      parseInt(patientDetails.weight) > 0 &&
      parseInt(patientDetails.weight) <= 200
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="header-toolbar">
          <IonTitle>AI Doctor</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <h2 className="section-title">Disease Treatment Predictor</h2>

        <IonCard className="form-section">
          <IonCardHeader>
            <IonCardTitle className="section-title">
              Select Disease
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem lines="none">
              <IonLabel position="stacked">Disease</IonLabel>
              <IonSelect
                value={selectedDisease}
                onIonChange={(e) => handleDiseaseChange(e.detail.value)}
                placeholder="Select a disease"
              >
                <IonSelectOption value="Malaria">Malaria</IonSelectOption>
                <IonSelectOption value="Dengue">Dengue</IonSelectOption>
                <IonSelectOption value="Typhoid">Typhoid</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {selectedDisease && (
          <IonCard className="form-section">
            <IonCardHeader>
              <IonCardTitle className="section-title">Symptoms</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                {symptomsList.map((symptom) => (
                  <IonItem key={symptom} lines="none" className="symptom-item">
                    <IonLabel>{symptom}</IonLabel>
                    <IonCheckbox
                      slot="end"
                      checked={
                        selectedSymptoms[
                          symptom.toLowerCase().replace(" ", "_")
                        ]
                      }
                      onIonChange={() => handleSymptomToggle(symptom)}
                      color="primary"
                    />
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        <IonCard className="form-section">
          <IonCardHeader>
            <IonCardTitle className="section-title">
              Patient Details
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem lines="none">
              <IonLabel position="stacked">Age</IonLabel>
              <IonInput
                type="number"
                value={patientDetails.age}
                onIonChange={(e) =>
                  handlePatientDetailChange("age", e.detail.value!)
                }
                min="1"
                max="120"
                required
              />
            </IonItem>
            <IonItem lines="none">
              <IonLabel position="stacked">Weight (kg)</IonLabel>
              <IonInput
                type="number"
                value={patientDetails.weight}
                onIonChange={(e) =>
                  handlePatientDetailChange("weight", e.detail.value!)
                }
                min="5"
                max="200"
                required
              />
            </IonItem>
            <IonItem lines="none">
              <IonLabel position="stacked">Region</IonLabel>
              <IonSelect
                value={patientDetails.region}
                onIonChange={(e) =>
                  handlePatientDetailChange("region", e.detail.value)
                }
              >
                <IonSelectOption value="Sub-Saharan Africa">
                  Sub-Saharan Africa
                </IonSelectOption>
                <IonSelectOption value="Papua New Guinea">
                  Papua New Guinea
                </IonSelectOption>
                <IonSelectOption value="Southeast Asia">
                  Southeast Asia
                </IonSelectOption>
                <IonSelectOption value="Central America west of Panama">
                  Central America west of Panama
                </IonSelectOption>
                <IonSelectOption value="Haiti">Haiti</IonSelectOption>
                <IonSelectOption value="Dominican Republic">
                  Dominican Republic
                </IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem lines="none">
              <IonLabel position="stacked">Gender</IonLabel>
              <IonSelect
                value={patientDetails.gender}
                onIonChange={(e) =>
                  handlePatientDetailChange("gender", e.detail.value)
                }
              >
                <IonSelectOption value="Male">Male</IonSelectOption>
                <IonSelectOption value="Female">Female</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Pregnant</IonLabel>
              <IonCheckbox
                slot="end"
                checked={patientDetails.pregnant}
                onIonChange={(e) =>
                  handlePatientDetailChange("pregnant", e.detail.checked)
                }
                color="primary"
              />
            </IonItem>
            <IonItem lines="none">
              <IonLabel>G6PD Deficiency</IonLabel>
              <IonCheckbox
                slot="end"
                checked={patientDetails.g6pd_deficiency}
                onIonChange={(e) =>
                  handlePatientDetailChange("g6pd_deficiency", e.detail.checked)
                }
                color="primary"
              />
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Previous Medications</IonLabel>
              <IonCheckbox
                slot="end"
                checked={patientDetails.previous_medications}
                onIonChange={(e) =>
                  handlePatientDetailChange(
                    "previous_medications",
                    e.detail.checked
                  )
                }
                color="primary"
              />
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonButton
          expand="block"
          onClick={handleSubmit}
          className="submit-button"
          disabled={!isFormValid() || loading}
        >
          {loading ? "Diagnosing..." : "Predict Treatment"}
        </IonButton>

        {error && (
          <IonCard className="error-card">
            <IonCardContent>
              <p className="error-message">{error}</p>
            </IonCardContent>
          </IonCard>
        )}

        {diagnosis && (
          <IonCard className="result-card">
            <IonCardHeader>
              <IonCardTitle className="result-title">
                Prediction Result
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                <strong>Selected Disease:</strong> {diagnosis.selectedDisease}
              </p>
              <p>
                <strong>Recommended Drug:</strong> {diagnosis.recommendedDrug}
              </p>

              <p>
                <strong>Dosage:</strong> {diagnosis.dosage}
              </p>
              <p>
                <strong>Tip:</strong> {diagnosis.tip}
              </p>
              {diagnosis.adjustment_message && (
                <p>
                  <strong>Adjustment:</strong> {diagnosis.adjustment_message}
                </p>
              )}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AIDoctorPage;
