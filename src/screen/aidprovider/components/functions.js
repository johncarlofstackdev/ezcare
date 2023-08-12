const CalculateMinuteAgo = (time) => {
    let timeLeft = 0
    const splitTime = time.split(":")
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const checkHour = hours - splitTime[0]
    const checkMin = minutes - splitTime[1]
    if (checkHour === 0) {
        timeLeft = checkMin + ' mins ago'
    } else if (checkHour === 1) {
        timeLeft = checkHour + ' hour ago'
    } else {
        timeLeft = checkHour + ' hours ago'
    }
    return timeLeft
}

const Time = () => {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

export { CalculateMinuteAgo, Time };