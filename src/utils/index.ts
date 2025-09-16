/**
 * 判断字符串是否为小数，并返回相关信息
 * @param {String} str 字符串
 * @returns {Object} 返回对象包含以下属性：
 * @returns {Boolean} isFloat - 是否为小数
 * @returns {String} [integer] - 整数部分（若为小数）
 * @returns {String} [decimal] - 完整小数格式如0.5（若为小数）
 */
export function isDecimal(str: string): { isFloat: boolean; integer?: string; decimal?: string } {
    const regex = /^(\d*)\.((\d+))$/
    const match = str.match(regex)

    if (match) {
        const integerPart = match[1] || '0' // 如果整数部分为空，补零
        const decimalPart = match[2]

        return {
            isFloat: true,
            integer: integerPart,
            decimal: `0.${decimalPart}` // 返回完整的0.xxx格式
        }
    }

    return {
        isFloat: false
    }
}

/**
 * 解析数字或带分数字符串并求和（eg.1.25 (1 5/8)）
 * @param {String} input 
 * @returns {Number}
 */
export function parseMixedNumberAndSum(input: string): number {
    const parts = input.trim().split(/\s+/) // 按空格分割
    let sum = 0
    let i = 0

    while (i < parts.length) {
        const current = parts[i]

        // 检查是否是纯数字
        if (/^\d+(\.\d+)?$/.test(current)) {
            sum += parseFloat(current)
            i++
        }
        // 检查是否是分数格式 (如 5/8)
        else if (/^\d+\/\d+$/.test(current)) {
            const [numerator, denominator] = current.split('/').map(Number)
            if (denominator !== 0) {
                sum += numerator / denominator
            }
            i++
        }
        // 检查是否是带分数格式 (如 1 5/8)
        else if (/^\d+$/.test(current) && i + 1 < parts.length && /^\d+\/\d+$/.test(parts[i + 1])) {
            const wholeNumber = parseInt(current)
            const [numerator, denominator] = parts[i + 1].split('/').map(Number)
            if (denominator !== 0) {
                sum += wholeNumber + numerator / denominator
            }
            i += 2 // 跳过下一个元素，因为已经处理了
        } else {
            // 跳过无效格式
            i++
        }
    }

    return sum
}