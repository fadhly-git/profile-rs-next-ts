export function isValidUrl(string: string) {
    try {
        // Allow relative URLs and absolute URLs
        if (string.startsWith('/') || string.startsWith('#')) {
            return true
        }
        new URL(string)
        return true
    } catch {
        return false
    }
}