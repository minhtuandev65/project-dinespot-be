/**
 * Tính toán giá trị bỏ qua cho phân trang dựa trên trang hiện tại và số mục trên mỗi trang.
 */
export const pagingSkipValue = (page, itemsPerPage) => {
    if (!page || !itemsPerPage) return 0
    if (page <= 0 || itemsPerPage <= 0) return 0
    return (page - 1) * itemsPerPage
}
