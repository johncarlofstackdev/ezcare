import React, { useState, useEffect } from "react";
import moment from "moment";

const TimeAgoRealTime = (props) => {
    const { dateRequested, timeRequested } = props;
    const [timeAgo, setTimeAgo] = useState("");

    console.log(dateRequested);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const [month, day, year] = dateRequested.split("/");
            const [hours, minutes] = timeRequested.split(":");
            const newDate = new Date(year, month - 1, day, hours, minutes);
            const newTimeAgo = moment(newDate).fromNow();
            setTimeAgo(newTimeAgo);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [dateRequested, timeRequested]);

    return timeAgo;
};

export default TimeAgoRealTime;