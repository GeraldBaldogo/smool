import type { RequestHandler } from './$types';
import {
	subscribeToReportEvents,
	type ReportStreamEvent
} from '$lib/server/report-events';

export const GET: RequestHandler = async ({ request }) => {
	const encoder = new TextEncoder();

	let unsubscribe: (() => void) | undefined;
	let keepAlive: NodeJS.Timeout | undefined;

	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			const send = (event: ReportStreamEvent | { type: 'connected' }) => {
				controller.enqueue(
					encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
				);
			};

			send({ type: 'connected' });

			unsubscribe = subscribeToReportEvents((event) => {
				send(event);
			});

			keepAlive = setInterval(() => {
				controller.enqueue(encoder.encode(`: keep-alive\n\n`));
			}, 15000);

			request.signal.addEventListener(
				'abort',
				() => {
					if (keepAlive) clearInterval(keepAlive);
					if (unsubscribe) unsubscribe();
					try {
						controller.close();
					} catch {}
				},
				{ once: true }
			);
		},

		cancel() {
			if (keepAlive) clearInterval(keepAlive);
			if (unsubscribe) unsubscribe();
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};