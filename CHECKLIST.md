# Nexus Hardening Checklist

- TypeScript strict mode ✓
- All routes protected with authenticate middleware ✓
- Refresh token rotation ✓
- Cursor pagination implemented ✓
- Socket rooms strategy ✓
- Presence TTL heartbeat ✓
- Cloudinary upload pipeline ✓
- Error boundary on all routes ✓
- Rate limiting on auth routes ✓
- Soft delete on messages ✓

## Next improvements

- Add end-to-end tests (Playwright)
- Add server-side rendering for SEO
- Migrate voice to SFU (LiveKit/mediasoup) for scale
- Add message search (MongoDB Atlas Search)
- Add push notifications (web push API)
- Add thread support inside channels
- Add screen share support (getDisplayMedia)
