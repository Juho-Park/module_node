import { format } from "date-fns";
import { ko } from "date-fns/locale/ko";

export function toString(date: Date | undefined, opt: { day?: boolean } = { day: true }) {
    if(!date) return ''
    return format(new Date(date), opt.day ? 'yyyy-MM-dd EEEE' : 'yyyy-MM-dd', { locale: ko });
}