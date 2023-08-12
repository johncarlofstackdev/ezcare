// == Google Map API == //
import MAP_API from "./api";

const fetchDistanceDuration = async (origin, destination) => {
  const endpoint = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${MAP_API()}`;

  try {
    const response = await fetch(endpoint);
    const { routes } = await response.json();
    const { distance, duration } = routes[0].legs[0];
    return { distance: distance.text, duration: duration.text };
  } catch (error) {
    console.error(error);
    return { status: false, error };
  }
};

export default fetchDistanceDuration;