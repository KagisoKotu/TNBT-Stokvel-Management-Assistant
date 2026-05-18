// Grab the base URL from the environment, or fall back to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const schedulePayout = async (payoutData) => {
    try {
        // Use backticks to dynamically insert the URL so it points to Render when live!
        const response = await fetch(`${API_BASE_URL}/payouts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // This is our VIP pass to get past the bouncer we just built!
                'x-user-role': 'Treasurer' 
            },
            body: JSON.stringify(payoutData)
        });

        const data = await response.json();

        // If the server throws a 400 or 403, we catch it here
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong scheduling the payout');
        }

        return data; // Returns the { message, payout } object from our backend
    } catch (error) {
        throw error;
    }
};