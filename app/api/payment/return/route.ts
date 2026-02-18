import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    return handleReturn(request);
}

export async function POST(request: NextRequest) {
    return handleReturn(request);
}

async function handleReturn(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        // Extract parameters common to Monime redirects
        const status = searchParams.get('status');
        const registrationId = searchParams.get('registration');

        // Construct the destination URL
        const destinationUrl = new URL('/workshops', request.url);

        if (status) destinationUrl.searchParams.set('payment', status);
        if (registrationId) destinationUrl.searchParams.set('registration', registrationId);

        // If Monime sends data in POST body, we might want to log it or use it, 
        // but for now relying on query params (which they usually append) is safer for the redirect.
        // If query params are missing in POST, we might need to parse body, but typically 
        // payment gateways append status to the URL even for POSTs.

        // Use 303 See Other to force a GET request to the destination
        return NextResponse.redirect(destinationUrl, 303);
    } catch (error) {
        console.error('Payment return handler error:', error);
        // Fallback redirect
        return NextResponse.redirect(new URL('/workshops', request.url), 303);
    }
}
