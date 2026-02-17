const jwt = require('jsonwebtoken');
const Activity = require('../models/Activity');

// Non-blocking activity logger: if token present, logs request/response metadata
module.exports = function activityLogger(req, res, next) {
    const start = Date.now();

    // Try to decode token if present
    let userId = null;
    try {
        const authHeader = req.headers.authorization || '';
        if (authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded?.id || null;
        }
    } catch (e) {
        // ignore decode errors; do not block
    }

    // After response finished, persist log
    res.on('finish', async () => {
        try {
            // Skip logging for swagger assets
            if (req.path.startsWith('/api-docs')) return;

            await Activity.create({
                user: userId,
                action: `${req.method} ${req.path}`,
                method: req.method,
                path: req.originalUrl || req.url,
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                statusCode: res.statusCode,
                meta: {
                    durationMs: Date.now() - start,
                    query: req.query,
                    // Never log sensitive fields
                    bodyKeys: Object.keys(req.body || {}).filter(k => !['password'].includes(k))
                }
            });
        } catch (_) {
            // swallow errors
        }
    });

    next();
}
