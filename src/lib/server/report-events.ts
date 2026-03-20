type ReportPayload = {
	id: string | number;
	name?: string;
	issue?: string;
	date?: string;
	status?: string;
	issue_description?: string;
	category?: string | null;
	subcategory?: string | null;
	created_at?: string;
	latitude?: number | null;
	longitude?: number | null;
	address?: string | null;
	landmark?: string | null;
	photo_url?: string | null;
	admin_feedback?: string | null;
	completion_photo_url?: string | null;
	completed_at?: string | null;
};

export type ReportStreamEvent =
	| { type: 'report_created'; report: ReportPayload }
	| { type: 'report_updated'; report: ReportPayload }
	| { type: 'report_status_changed'; report: ReportPayload };

const listeners = new Set<(event: ReportStreamEvent) => void>();

export function subscribeToReportEvents(
	listener: (event: ReportStreamEvent) => void
) {
	listeners.add(listener);

	return () => {
		listeners.delete(listener);
	};
}

export function emitReportEvent(event: ReportStreamEvent) {
	for (const listener of listeners) {
		listener(event);
	}
}