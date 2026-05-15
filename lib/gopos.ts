/**
 * GoPOS Integration Service
 * Handles real-time order notifications ("pings") to restaurant terminals.
 */

const GOPOS_CLIENT_ID = process.env.GOPOS_CLIENT_ID;
const GOPOS_CLIENT_SECRET = process.env.GOPOS_CLIENT_SECRET;
const GOPOS_ORG_ID = process.env.GOPOS_ORG_ID;
const GOPOS_BASE_URL = 'https://app.gopos.io';

interface GoPosAuthResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

/**
 * Fetches an OAuth2 access token from GoPOS
 */
async function getGoPosToken(): Promise<string | null> {
    if (!GOPOS_CLIENT_ID || !GOPOS_CLIENT_SECRET || !GOPOS_ORG_ID) {
        console.error('[GoPOS] Missing credentials in environment variables');
        return null;
    }

    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'organization');
        params.append('client_id', GOPOS_CLIENT_ID);
        params.append('client_secret', GOPOS_CLIENT_SECRET);
        params.append('organization_id', GOPOS_ORG_ID);

        const response = await fetch(`${GOPOS_BASE_URL}/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: params
        });

        if (!response.ok) {
            const error = await response.text();
            console.error(`[GoPOS] Auth failed (${response.status}):`, error);
            return null;
        }

        const data: GoPosAuthResponse = await response.json();
        return data.access_token;
    } catch (err) {
        console.error('[GoPOS] Auth error:', err);
        return null;
    }
}

/**
 * Sends a detailed order to the GoPOS terminal
 * @param orderNumber The website order number (e.g. B-1234)
 * @param customerName The name of the customer
 * @param items The list of items from the cart
 * @param deliveryFee The delivery fee amount
 */
export async function sendGoPosNotification(
    orderNumber: string, 
    customerName: string, 
    items: any[], 
    deliveryFee: number = 0
) {
    console.log(`[GoPOS] Sending detailed order #${orderNumber} to terminal...`);

    const token = await getGoPosToken();
    if (!token) return { success: false, error: 'Authentication failed' };

    try {
        const now = new Date().toISOString().split('.')[0];
        
        // Map website items to GoPOS format
        const goposItems = items.map(item => ({
            name: item.name.toUpperCase(),
            quantity: item.quantity,
            unit_price: {
                amount: item.price,
                currency: "PLN"
            },
            tax: { id: 1 }, // Default tax ID
            comment: item.description || ""
        }));

        // Add Delivery Fee as a separate item if applicable
        if (deliveryFee > 0) {
            goposItems.push({
                name: "DOSTAWA (DELIVERY FEE)",
                quantity: 1,
                unit_price: {
                    amount: deliveryFee,
                    currency: "PLN"
                },
                tax: { id: 1 },
                comment: "Opłata za dowóz"
            });
        }

        const payload = {
            type: "DELIVERY",
            terminal_name: "Sklep Online Basma",
            execution_at: now,
            items: goposItems,
            comment: `ZAMÓWIENIE STRONA WWW #${orderNumber}. PROSZĘ SPRAWDZIĆ DASHBOARD!`,
            source: "EXTERNAL",
            transactions: [],
            contact: {
                name: customerName,
                phone_number: "000000000" // We don't necessarily need to sync phone here if it's on the dashboard
            }
        };

        const response = await fetch(`${GOPOS_BASE_URL}/api/v3/${GOPOS_ORG_ID}/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.text();
            console.error(`[GoPOS] Order push failed (${response.status}):`, error);
            return { success: false, error };
        }

        const data = await response.json();
        console.log(`[GoPOS] Detailed order sent successfully! GoPOS Order ID: ${data.data?.id}`);
        return { success: true, id: data.data?.id };
    } catch (err) {
        console.error('[GoPOS] Notification error:', err);
        return { success: false, error: err };
    }
}
