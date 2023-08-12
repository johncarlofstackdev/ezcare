// == Map == //
import Geolocation from "react-native-geolocation-service";

const Location = async () => {
    try {
        const position = await new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
            });
        });
        return { status: true, Position: position }
    } catch (error) {
        return { status: false, error: error }
    }
}

export { Location };