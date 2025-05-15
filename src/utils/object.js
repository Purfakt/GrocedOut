export const sanitizeUndefinedRecursive = (obj) => {
    if (obj === undefined) {
        return null
    }
    if (Array.isArray(obj)) {
        return obj.map(sanitizeUndefinedRecursive)
    }
    if (typeof obj === 'object' && obj !== null) {
        const sanitizedObj = {}
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                sanitizedObj[key] = sanitizeUndefinedRecursive(obj[key])
            }
        }
        return sanitizedObj
    }
    return obj
}