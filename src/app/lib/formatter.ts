export const formatNumber = (value: number | undefined): string =>
{
    if (value === undefined || isNaN(value))
        return "0"// Handle undefined values

    // return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
    return new Intl.NumberFormat("en-US",
    {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}