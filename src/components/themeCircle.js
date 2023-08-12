import { Icon } from "native-base"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

const ThemeCircle = () => {
    return (
      <>
        <Icon as={<MaterialIcons name="circle" />} size={200} ml="2" color="#f63b3b" style={{ position: 'absolute', top: -60, right: -60 }} />
        <Icon as={<MaterialIcons name="circle" />} size={150} ml="2" color="#f63b3b" style={{ position: 'absolute', bottom: -60, left: -60 }} />
        <Icon as={<MaterialIcons name="circle" />} size={70} ml="2" color="#ff6c6c" style={{ position: 'absolute', top: 20, right: 90 }} />
      </>
    )
}

export default ThemeCircle