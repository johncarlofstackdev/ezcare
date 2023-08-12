
import React, { useEffect, useState, memo } from "react";
import { auth, db, storage } from "../../../../config"
import { Marker } from "react-native-maps";
import MapIcon from "../../../components/mapIcons";

const ListHelp = ({ IconHelp, Press, serviceType }) => {
    const [data, setData] = useState({});
    const keyS = Object.keys(data);

    useEffect(() => {
        const ref = 'incedent/'
        const rootRef = db.ref(ref)
        const PeopleAskingHelp = async () => {
            rootRef.on('value', snap => {
                if (snap.exists()) {
                    const data = {};
                    snap.forEach(childSnapshot => {
                        const childData = childSnapshot.val();
                        if (childData.status === 1 && childData.serviceType == serviceType) {
                            data[childSnapshot.key] = childData;
                        }
                    });
                    setData(data)
                } else {
                    setData({})
                }
            })
        }
        PeopleAskingHelp()
    }, []);

    return keyS.length !== 0 && (
        keyS.map((keyName, i) => (
            < Marker
                coordinate={{ latitude: data[keyName].location.latitude, longitude: data[keyName].location.longitude }}
                image={MapIcon(data[keyName].serviceType).services}
                identifier={keyName}
                onPress={Press}
                key={i}
            />
        ))
    );
};

export default ListHelp;