import crypto from "crypto"

const MERCHANT_ID = process.env.P24_MERCHANT_ID
const POS_ID = process.env.P24_POS_ID || MERCHANT_ID
const CRC_KEY = process.env.P24_CRC_KEY
const API_KEY = process.env.P24_API_KEY
const IS_SANDBOX = process.env.P24_SANDBOX === "true"

const BASE_URL = IS_SANDBOX
    ? "https://sandbox.przelewy24.pl/api/v1"
    : "https://secure.przelewy24.pl/api/v1"

const REDIRECT_BASE_URL = IS_SANDBOX
    ? "https://sandbox.przelewy24.pl/trnRequest"
    : "https://secure.przelewy24.pl/trnRequest"

interface TransactionRequest {
    sessionId: string
    amount: number
    currency: string
    description: string
    email: string
    client: string
    address: string
    zip: string
    city: string
    country: string
    urlReturn: string
    urlStatus: string
    language: string
}

export class Przelewy24 {
    private static getHeaders() {
        const auth = Buffer.from(`${MERCHANT_ID}:${API_KEY}`).toString("base64")
        return {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
        }
    }

    private static generateSignature(data: { sessionId: string; amount: number; currency: string }): string {
        // For V2.1 /api/v1/transaction/register, the signature is sha384({"sessionId":"...","merchantId":... ,"amount":... ,"currency":"...","crc":"..."})
        // Essential: EXACT field order, NO SPACES, merchantId as NUMBER
        const hashStr = JSON.stringify({
            sessionId: data.sessionId,
            merchantId: Number(MERCHANT_ID),
            amount: data.amount,
            currency: data.currency,
            crc: CRC_KEY
        })
        return crypto.createHash("sha384").update(hashStr).digest("hex")
    }

    static async registerTransaction(params: TransactionRequest) {
        const sign = this.generateSignature({
            sessionId: params.sessionId,
            amount: params.amount,
            currency: params.currency
        })

        const requestData = {
            ...params,
            merchantId: Number(MERCHANT_ID),
            posId: Number(POS_ID),
            sign
        }

        console.log("P24 Register Request:", JSON.stringify(requestData, null, 2))

        const response = await fetch(`${BASE_URL}/transaction/register`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(requestData),
        })

        const result = await response.json()
        if (!response.ok) {
            console.error("P24 Register Error:", result)
            throw new Error(`Przelewy24 Error: ${JSON.stringify(result.errors || result)}`)
        }

        return {
            token: result.data.token,
            redirectUrl: `${REDIRECT_BASE_URL}/${result.data.token}`,
        }
    }

    static async verifyTransaction(params: { sessionId: string; amount: number; currency: string; orderId: number }) {
        // For V2.1 verify, signature is sha384({"sessionId":"...","orderId":... ,"amount":... ,"currency":"...","crc":"..."})
        const hashStr = JSON.stringify({
            sessionId: params.sessionId,
            orderId: params.orderId,
            amount: params.amount,
            currency: params.currency,
            crc: CRC_KEY
        })
        const sign = crypto.createHash("sha384").update(hashStr).digest("hex")

        const requestData = {
            merchantId: Number(MERCHANT_ID),
            posId: Number(POS_ID),
            sessionId: params.sessionId,
            amount: params.amount,
            currency: params.currency,
            orderId: params.orderId,
            sign,
        }

        const response = await fetch(`${BASE_URL}/transaction/verify`, {
            method: "PUT",
            headers: this.getHeaders(),
            body: JSON.stringify(requestData),
        })

        const result = await response.json()
        if (!response.ok) {
            console.error("P24 Verify Error:", result)
            return { ok: false, error: result }
        }

        return { ok: true, data: result.data }
    }

    static verifyNotificationSign(data: {
        merchantId: number
        posId: number
        sessionId: string
        amount: number
        originAmount: number
        currency: string
        orderId: number
        methodId: number
        statement: string
        sign: string
    }): boolean {
        // For notification, signature is sha384({"merchantId":... ,"posId":... ,"sessionId":"...","amount":... ,"originAmount":... ,"currency":"...","orderId":... ,"methodId":... ,"statement":"...","crc":"..."})
        const hashStr = JSON.stringify({
            merchantId: data.merchantId,
            posId: data.posId,
            sessionId: data.sessionId,
            amount: data.amount,
            originAmount: data.originAmount,
            currency: data.currency,
            orderId: data.orderId,
            methodId: data.methodId,
            statement: data.statement,
            crc: CRC_KEY
        })
        const calculatedSign = crypto.createHash("sha384").update(hashStr).digest("hex")
        return calculatedSign === data.sign
    }
}
