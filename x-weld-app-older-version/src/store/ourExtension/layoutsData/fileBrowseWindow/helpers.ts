export const parseUnixDate = (unixDate: number): string => {
    const date = new Date(unixDate * 1000);
    let day = date.getDate().toString();
    let month = date.getMonth() + 1 + "";
    if (day.length === 1) {
        day = "0" + day;
    }

    if (month.length === 1) {
        month = "0" + month;
    }
    return `${day}.${month}.${date.getFullYear()}`;
}