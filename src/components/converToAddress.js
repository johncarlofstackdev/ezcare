// == Google Map API == //
import MAP_API from "./api";

const fetchAddress = async (latitude, longitude) => {
    const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng`
    try {
        const response = await fetch(`${endpoint}=${latitude},${longitude}&key=${MAP_API()}`)
        const data = await response.json()
        return {status: true, address:  data.results[0].formatted_address}
    } catch (e) {
        return {status: false, error: e}
    }
}

export default fetchAddress