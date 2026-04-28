/**
 * Generates a session token based on a secret.
 * This implementation uses Web Crypto API which is available in both 
 * Node.js and Edge Runtime (Next.js Middleware).
 */
export async function generateSessionToken(secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const data = encoder.encode('authenticated');

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
    
    // Convert BufferSource to hex string
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
