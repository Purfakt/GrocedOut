export const sanitizeUndefinedRecursive = (obj) => {
    if (obj === undefined) {
        return undefined
    }
    if (Array.isArray(obj)) {
        return obj.map(sanitizeUndefinedRecursive)
    }
    if (typeof obj === 'object' && obj !== null) {
        const sanitizedObj = {}
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = sanitizeUndefinedRecursive(obj[key])
                if (value !== undefined) {
                    sanitizedObj[key] = value
                }
            }
        }
        return sanitizedObj
    }
    return obj
}