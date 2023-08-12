import * as React from "react";
import { StyleSheet, Linking } from "react-native";
import { NativeBaseProvider } from "native-base";

import { db, auth } from "../../../config";
import Dimension from "../../components/Dimension";
import Map from "./components/map";
import EventInformation from "./components/eventInformation";
import ReportForm from "./components/reportForm";
import { Time } from "./components/functions";
import Success from "./components/sucess";
import AlertToast from "../../components/toast";
import ConfirmationRequest from "./components/confirmationrequest";
import CheckRequest from "./components/ambulanceNotification";

import CodeGenerator from "../../components/codeGenerator";

const Event = ({ navigation, route }) => {
    const eventId = Object.keys(route.params)[0]; // Event reference code

    // States
    const [eventNewData, eventNewDataSet] = React.useState(route.params[eventId]);
    const [SHReportForm, SHReportFormSet] = React.useState(false); // Show or Hide Report Form State
    const [reportFormData, reportFormDataSet] = React.useState({ event_type: "", event_details: "" });
    const [successState, successStateSet] = React.useState(false); // Show or Hide Report Form State
    const [requestConfirmation, requestConfirmationSet] = React.useState(false);

    // Event effects 
    React.useEffect(() => {
        const ref = "incedent/" + eventId + "/";
        const rootRef = db.ref(ref);
        rootRef.on('value', snap => {
            if (snap.exists()) {
                const userData = snap.val();
                eventNewDataSet(userData);
            }
        });
    }, []);


    // ***** START EVENT FUNCTIONS ****** //

    // This will call to aid seeker
    const makeCall = React.useCallback((phone) => {
        let url = "tel:" + phone;
        Linking.openURL(url);
    }, []);

    // This will show the report form
    const openReport = React.useCallback(() => {
        SHReportFormSet(true);
    }, []);

    // This will close the report form
    const closeReport = React.useCallback(() => {
        SHReportFormSet(false);
    }, []);

    // This will submit the form
    const sumbitReport = React.useCallback(async () => {
        successStateSet(true);

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        const currentDate = month + "/" + day + "/" + year;

        const currentTime = Time();
        const updateData = { ...reportFormData, status: 3, time_close: currentTime, date_close: currentDate };
        const reference = "incedent/" + eventId + "/";
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 2 seconds
            await db.ref(reference).update(updateData);
            AlertToast("Report successfully submitted", "success", "success", "top");
            successStateSet(false);
            reportFormDataSet({ event_type: "", event_details: "" });
            SHReportFormSet(false);
        } catch (error) {
            AlertToast(error, "success", "success", "top");
        }
    }, [eventId, reportFormData]);

    const AmbulanceRequest = React.useCallback(() => {
        requestConfirmationSet(true);
    }, []);

    const closeRequest = React.useCallback(() => {
        requestConfirmationSet(false);
    }, []);

    const RequestAmbulance = React.useCallback(async () => {
        try {
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
    
            const currentDate = month + "/" + day + "/" + year;

            const currentTime = Time();

            const Code = CodeGenerator(6);
            const referenceCode = CodeGenerator(15);
            const reference = `ambulance/${referenceCode}`;

            const data = {
                code: Code,
                event_id: eventId,
                provider_id: auth.currentUser.uid,
                status: false,
                readStatus: false,
                date_requested: currentDate,
                time: currentTime,
                NewlyAddedCheck: true,
                admin_read: false
            };

            const reference2 = `incedent/${eventId}/`;
            const data2 = { ambulance_Request: Code };

            requestConfirmationSet(false);
            successStateSet(true);

            await Promise.all([
                db.ref(reference).set(data),
                db.ref(reference2).update(data2),
            ]);

            AlertToast("Successfully requested an ambulance.", "success", "success", "top");
        } catch (error) {
            console.error(error);
            AlertToast("Failed to request an ambulance.", "error", "error", "top");
        } finally {
            successStateSet(false);
        }
    }, [eventId, auth]);

    const closeModal = React.useCallback(async (referenceAmbuID) => {
        try {
            const reference2 = `ambulance/${referenceAmbuID}/`;
            await db.ref(reference2).update({ readStatus: true })
        } catch (error) {
            console.log(error);
        }
    }, []);

    // ***** END EVENT FUNCTIONS ****** //


    // ***** START CHILD COMPOMENT PROPS ****** //
    const EventInformationProps = {
        functions: {
            makeACall: makeCall,
            report: openReport,
            requestAmulance: AmbulanceRequest
        },
        styles: {
            design: styles
        },
        states: {
            eventInformation: eventNewData,
        }
    }

    const ReportFormProps = {
        functions: {
            closeReportForm: closeReport,
            submitReportForm: sumbitReport
        },
        states: {
            SHReportForm: SHReportForm,
            statesReportFormData: reportFormData
        },
        sets: {
            setsReportValue: reportFormDataSet
        }
    }

    const SuccessProps = {
        states: {
            successState: successState,
        }
    }

    const ConfirmationProps = {
        states: {
            requestConfirmation: requestConfirmation,
        },
        functions: {
            request: RequestAmbulance,
            closeRequest: closeRequest
        }
    }

    const checkRequestProps = {
        functions: {
            closeModal: closeModal,
        }
    }
    // ***** END CHILD COMPOMENT PROPS ****** //

    return (
        <NativeBaseProvider>
            <Map eventInformation={eventNewData} />
            <EventInformation {...EventInformationProps} />
            <ReportForm {...ReportFormProps} />
            <Success {...SuccessProps} />
            <ConfirmationRequest {...ConfirmationProps} />
            <CheckRequest {...checkRequestProps} />
        </NativeBaseProvider>
    )
};

const styles = StyleSheet.create({
    map: {
        width: Dimension.Width,
        height: Dimension.Height,
    }, container: {
        position: 'absolute',
        top: 30,
        left: 30,
        right: 30,
        padding: 20,
        borderRadius: 10
    },
    containerBottom: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        borderRadius: 30
    },
    containerLeftBottom: {
        padding: 20,
        borderRadius: 10
    },
    containerRightBottom: {
        padding: 20,
        borderRadius: 10
    }
});

export default Event;
