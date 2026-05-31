import * as PortOne from "@portone/server-sdk"

const globalForPortOne = global as unknown as {
    portone: ReturnType<typeof PortOne.PortOneClient> | undefined;
};
const portone = globalForPortOne.portone ?? PortOne.PortOneClient({ secret: process.env.PO_API_SECRET });
if (process.env.NODE_ENV !== "production") globalForPortOne.portone = portone;

// ref - https://portone-io.github.io/server-sdk/js/types/IdentityVerification.IdentityVerification.html
export type VerficiationResult = Awaited<ReturnType<typeof getIdentityVerification>>;
export async function getIdentityVerification(identityVerificationId: string): Promise<{
    status: "READY" | "VERIFIED" | "FAILED";
    verifiedCustomer?: {
        ci: string,
        name: string; phoneNumber: string, birthDate: Date, gender: string,
        isForeigner: boolean
    };
    failure?: { code: string; message: string };
}> {
    return portone.identityVerification.getIdentityVerification({ identityVerificationId }) as any
}

export async function getPayment(paymentId: string) {
    return portone.payment.getPayment({ paymentId })
}