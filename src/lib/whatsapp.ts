/**
 * WhatsApp Notification Helper
 * 
 * Supports Meta Cloud API and Evolution API.
 * Configuration should be added to .env.local
 */

interface SendMessageParams {
    to: string;
    message: string;
}

export const whatsapp = {
    /**
     * Sends a simple text message via the configured API
     */
    async sendMessage({ to, message }: SendMessageParams) {
        const provider = process.env.WHATSAPP_PROVIDER || 'mock';

        console.log(`[WhatsApp ${provider}] Sending to ${to}: ${message}`);

        if (provider === 'mock') {
            return { success: true, id: 'mock-id-' + Date.now() };
        }

        if (provider === 'meta') {
            // Implementation for Meta Cloud API
            const url = `https://graph.facebook.com/v17.0/${process.env.META_PHONE_NUMBER_ID}/messages`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to,
                    type: "text",
                    text: { body: message }
                }),
            });
            return response.json();
        }

        if (provider === 'evolution') {
            // Implementation for Evolution API
            const url = `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'apikey': process.env.EVOLUTION_API_KEY || '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    number: to,
                    text: message,
                    delay: 1200,
                    linkPreview: false,
                }),
            });
            return response.json();
        }
    },

    /**
     * High-level helper for booking confirmations
     */
    async sendBookingConfirmation(appointment: any, orgName: string) {
        const dateStr = new Date(appointment.start_time).toLocaleDateString();
        const timeStr = new Date(appointment.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const message = `¡Hola! Tu reserva en *${orgName}* ha sido confirmada.\n\n📅 Fecha: ${dateStr}\n⏰ Hora: ${timeStr}\n\nTe esperamos. Si necesitas cancelar o reprogramar, avísanos con tiempo.`;

        return this.sendMessage({
            to: appointment.customers.whatsapp_number,
            message
        });
    }
};
