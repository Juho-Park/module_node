import * as PortOne from "@portone/browser-sdk/v2";

const BaseUrl = process.env.BASE_URL || 'http://localhost:3000'
const PortoneStoreId = process.env.NEXT_PUBLIC_PO_STORE_ID;
const PortoneChannels = {
    KCP_ID: process.env.NEXT_PUBLIC_PO_KCP_ID_CHANNEL,
    TOSS_PAY: process.env.NEXT_PUBLIC_PO_TOSS_PAY_CHANNEL
}

type VerificationResponseCode = 'FAILURE_TYPE_PG' | string
export function popupVerification(identityVerificationId: string): Promise<{
    code?: VerificationResponseCode; message?: string;
    pgCode?: string; pgMessage?: string
} | void> {
    if (!PortoneStoreId || !PortoneChannels.KCP_ID) {
        throw Error(`PortOne store ID or channel key is not set. storeId: ${PortoneStoreId}, channelKey: ${PortoneChannels.KCP_ID}`)
    }
    if (process.env.NODE_ENV === 'development') {
        identityVerificationId = 'v2-test-' + crypto.randomUUID()
        identityVerificationId = identityVerificationId.slice(0, 30) // 포트원에서 허용하는 최대 길이로 자르기
    }
    return PortOne.requestIdentityVerification({
        storeId: PortoneStoreId, channelKey: PortoneChannels.KCP_ID,
        identityVerificationId, // 고유한 본인 인증 ID (예: UUID)
    })
}

/**
 * @param reservationId 예약 고유 ID
 * @param paymentId 주문 고유 ID
 * @param orderName 주문 내용
 * @param totalAmount 결제 금액
 * @returns 
 */
export function popupPayment(reservationId: string, paymentId: string, orderName: string, totalAmount: number) {
    if (!PortoneStoreId || !PortoneChannels.TOSS_PAY) {
        throw Error(`PortOne store ID or channel key is not set. storeId: ${PortoneStoreId}, channelKey: ${PortoneChannels.TOSS_PAY}`)
    }
    const redirectUrl = `${BaseUrl}/reservations/${reservationId}`
    return PortOne.requestPayment({
        storeId: PortoneStoreId,
        channelKey: PortoneChannels.TOSS_PAY,
        currency: "KRW",
        payMethod: "EASY_PAY",
        redirectUrl,
        forceRedirect: true,
        paymentId,
        orderName,
        totalAmount,
        // customer: {
        //     fullName: "포트원",
        //     phoneNumber: "010-0000-1234",
        //     email: "test@portone.io",
        // },
    })
}
