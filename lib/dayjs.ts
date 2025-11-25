import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/uk";

dayjs.locale("uk"); // use locale globally
dayjs.extend(localizedFormat);

export default dayjs;
