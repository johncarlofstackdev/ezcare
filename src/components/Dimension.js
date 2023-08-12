

// == React | React Native == //
import { Dimensions } from "react-native";

const Dimension = () => {
    return {
        Width: Dimensions.get("window").width,
        Height: Dimensions.get("window").height
    }
}

export default Dimension()