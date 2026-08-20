export const conservationStatusClass = (status) => {
    const statusKey = String(status ?? '').trim().toLowerCase()

    if (statusKey.includes('critically endangered') || statusKey === 'endangered') return 'danger'
    if (statusKey === 'vulnerable') return 'warning'
    if (statusKey === 'near threatened') return 'info'
    if (statusKey === 'least concern') return 'success'
    if (statusKey.includes('extinct')) return 'dark'
    return 'secondary'
}
