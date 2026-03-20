const connections = new Set<WritableStreamDefaultWriter>();

export function addConnection(writer: WritableStreamDefaultWriter) {
    connections.add(writer);
}

export function removeConnection(writer: WritableStreamDefaultWriter) {
    connections.delete(writer);
}

export function broadcastUpdate(report: any) {
    const data = `data: ${JSON.stringify(report)}\n\n`;
    for (const writer of connections) {
        try {
            writer.write(new TextEncoder().encode(data));
        } catch (err) {
            console.error('SSE broadcast failed, removing connection', err);
            connections.delete(writer);
        }
    }
}
