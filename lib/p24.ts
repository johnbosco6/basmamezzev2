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

    private static generateSignature(data: any): string {
        const json = JSON.stringify(data)
        // For V2.1 /api/v1/transaction/register, the signature is sha384(sessionId,merchantId,amount,currency,crc)
        const hashStr = `${data.sessionId},${MERCHANT_ID},${data.amount},${data.currency},${CRC_KEY}`
        return crypto.createHash("sha384").update(hashStr).digest("hex")
    }

    static async registerTransaction(params: TransactionRequest) {
        const requestData = {
            ...params,
            merchantId: Number(MERCHANT_ID),
            posId: Number(POS_ID),
            sign: this.generateSignature({
                sessionId: params.sessionId,
                amount: params.amount,
                currency: params.currency
            }),
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
        // For V2.1 /api/v1/transaction/verify, signature is sha384(sessionId,orderId,amount,currency,crc)
        const hashStr = `${params.sessionId},${params.orderId},${params.amount},${params.currency},${CRC_KEY}`
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
            method: "PUT", // Docs specify PUT for verify
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
        // For notification, signature is sha384(merchantId,posId,sessionId,amount,originAmount,currency,orderId,methodId,statement,crc)
        const hashStr = `${data.merchantId},${data.posId},${data.sessionId},${data.amount},${data.originAmount},${data.currency},${data.orderId},${data.methodId},${data.statement},${CRC_KEY}`
        const calculatedSign = crypto.createHash("sha384").update(hashStr).digest("hex")
        return calculatedSign === data.sign
    }
}
