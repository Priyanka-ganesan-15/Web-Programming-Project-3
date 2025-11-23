
export const formatDate = (dateStr) => {
    try {
        const d = new Date(dateStr);
        return d.toLocaleString();
    } catch (e) {
        return dateStr;
    }
};

export const initials = (user) => {
    if (!user) return '?';
    const first = user.first_name || '';
    const last = user.last_name || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
};