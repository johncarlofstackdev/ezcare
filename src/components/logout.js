
// == Auth : FIREBASE == //
import { auth } from "../../config"

const Logout = () => {
    return auth.signOut()
}

export default Logout