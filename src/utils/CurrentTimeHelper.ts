import { DateTime } from "luxon";

export const getCurrentTime = () => DateTime.now().setZone('Asia/Manila').toFormat('yyyy-LL-dd HH:mm:ss')