import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    let interval: NodeJS.Timeout;

    const stream = new ReadableStream({
        start(controller) {
            interval = setInterval(() => {
                try {
                    const data = { id: 1, status: 'Pending' };
                    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
                } catch (err) {
                    clearInterval(interval);
                }
            }, 5000);
        },
        cancel() {
            clearInterval(interval);
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
};
