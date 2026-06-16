import { format, isPast } from "date-fns";
import { ko } from "date-fns/locale/ko";

function _format(date: Date | undefined, opt: { day?: boolean } = { day: true }) {
    if (!date) return ''
    return format(new Date(date), opt.day ? 'yyyy-MM-dd EEEE' : 'yyyy-MM-dd', { locale: ko });
}

function _isPast(date: Date) {
    if (!date) return false;
    return isPast(new Date(date));
}

export default {
    format: _format,
    isPast: _isPast
}
