
// First Aider
import helpImage from "../assets/img/help_aid_seeker_(200_x_200).png";
import providerImage from '../assets/img/aid_provider_(3)_100_x_100.png';

// Police
import PoliceHelpImage from "../assets/img/Police-Request-removebg-preview(200x200).png";
import PoliceImage from '../assets/img/police-removebg-preview(100x100).png';

// BFP
import BFPhelpImage from "../assets/img/BFP-Request-removebg-preview(200x200).png";
import BFPImage from '../assets/img/BFP-removebg-preview(100x100).png';

const MapIcon = (serviceType) => {
    if (serviceType == 1) {
        return { services: helpImage, me: providerImage };
    }

    if (serviceType == 2) {
        return { services: PoliceHelpImage, me: PoliceImage };
    }

    return { services: BFPhelpImage, me: BFPImage };
};

export default MapIcon;