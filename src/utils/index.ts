/**
 * 判断字符串是否为小数，并返回相关信息
 * @param {String} str 字符串
 * @returns {Object} 返回对象包含以下属性：
 * @returns {Boolean} isFloat - 是否为小数
 * @returns {String} integer - 整数部分（若为小数）
 * @returns {String} decimal - 完整小数格式如0.5（若为小数）
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

interface MixNumberHandleReturnProps {
    type: 'mixnumber' | 'fraction' | ''
    whole?: number,
    numerator?: number
    denominator?: number
    decimalValue?: number
    value?: string
}
// 匹配带分数 "1 5/8" 格式
export const mixedNumberRegex = /^(\d+)\s+(\d+)\/(\d+)$/

// 匹配纯分数 "5/8" 格式
export const fractionRegex = /^(\d+)\/(\d+)$/
/**
 * 带分数处理或分数处理，拆分出对应的整数、分子、分母、和带分数转成小数的结果
 * 如果不满足带分数和分数直接返回输入值
 * @param {String} input 输入的（带）分数字符串
 * @param {Function} handleFn 提供处理函数，参数为当前返回值
 * @returns {MixNumberHandleReturnProps}
 */
export function mixNumberOrFractionHandle(input: string, handleFn?: ((ret: MixNumberHandleReturnProps) => void)): MixNumberHandleReturnProps {
    let result: MixNumberHandleReturnProps

    // 合规的带分数
    if (mixedNumberRegex.test(input.trim())) {
        const match = input.trim().match(mixedNumberRegex)
        const whole = parseInt(match[1]) // 整数部分
        const numerator = parseInt(match[2]) // 分数部分-分子
        const denominator = parseInt(match[3]) // 分数部分-分母
        const decimalValue = whole + numerator / denominator
        result = {
            type: 'mixnumber',
            whole,
            numerator,
            denominator,
            decimalValue
        }
    }

    // 合规的纯分数
    else if (fractionRegex.test(input.trim())) {
        const match = input.trim().match(fractionRegex)
        const numerator = parseInt(match[1])
        const denominator = parseInt(match[2])
        const decimalValue = numerator / denominator
        result = {
            type: 'fraction',
            numerator,
            denominator,
            decimalValue
        }
    }

    else {
        result = {
            type: '',
            value: input
        }
    }

    handleFn?.(result)

    return result
}

/**
 * 辅助函数：将小数转换为带分数字符串
 * @param decimal 小数
 * @param denominator 带分数的分母
 * @returns 
 */
// export function convertToMixedNumber(decimal: number, denominator: number ): string {
//     if (decimal < 0) return '0'

//     const whole = Math.floor(decimal)
//     const fractionalPart = decimal - whole

//     if (fractionalPart === 0) {
//         return whole.toString()
//     }

//     // 将小数部分转换为分数（以指定分母，常用于英制测量）
//     const numerator = Math.round(fractionalPart * denominator)

//     if (numerator === 0) {
//         return whole.toString()
//     } else if (numerator === denominator) {
//         return (whole + 1).toString()
//     } else if (whole === 0) {
//         return `${numerator}/${denominator}`
//     } else {
//         return `${whole} ${numerator}/${denominator}`
//     }
// }

export function convertToMixedNumber(decimal: number, denominator: number): { wholePart: string, fracPart: string } {
    if (decimal < 0) return { wholePart: '', fracPart: '' }

    const whole = Math.floor(decimal)
    const fractionalPart = decimal - whole

    if (fractionalPart == 0) return { wholePart: whole.toString(), fracPart: '' }

    // 将小数部分转换为分数（以指定分母，常用于英制测量）
    const numerator = Math.round(fractionalPart * denominator)

    if (numerator == 0) return { wholePart: whole.toString(), fracPart: '' }

    if (numerator == denominator) return { wholePart: (whole + 1).toString(), fracPart: '' }

    return { wholePart: whole.toString(), fracPart: `${numerator}/${denominator}` }
}


/**
 * 辅助函数，解析出分数的分子和分母
 * @param fraction 
 * @returns 
 */
export function parseFraction(fraction: string) {
    // 验证输入格式（仅允许数字、/，且分子分母为非负整数）
    const regex = /^(\d+)(\/(\d+))?$/;
    const match = fraction.match(regex);
    if (!match) {
        return {
            isValid: false,
            message: '无效分数格式'
        }
    }
    const numerator = BigInt(match[1]); // 分子（BigInt避免大数溢出）
    const denominator = match[3] ? BigInt(match[3]) : BigInt(1); // 分母默认1（整数情况）

    if (denominator === 0n) {
        return {
            isValid: false,
            message: '分母不能为0'
        }
    }
    return { isValid: true, numerator, denominator };
}

/**
 * 计算最大公约数，欧几里得算法
 * @param a 
 * @param b 
 * @returns 
 */
export function gcd(a, b) {
    a = a < 0n ? -a : a; // 取绝对值
    b = b < 0n ? -b : b;
    while (b !== 0n) [a, b] = [b, a % b];
    return a;
};

/**
 * 约分分数，返回最简分数
 * @param num 
 * @param den 
 * @returns 
 */
export function reduceFraction(num, den) {
    if (num === 0n) return [0n, 1n]; // 分子为0时，分母固定为1
    const commonDivisor = gcd(num, den);
    let reducedNum = num / commonDivisor;
    let reducedDen = den / commonDivisor;

    // 确保分母为正（负号移到分子）
    if (reducedDen < 0n) {
        reducedNum = -reducedNum;
        reducedDen = -reducedDen;
    }
    return [reducedNum, reducedDen];
};

export function fractionOperation(frac1, frac2, operation) {
    // 解析两个分数
    const parsed1 = parseFraction(frac1);
    if (!parsed1.isValid) throw new Error(parsed1.message);
    const n1 = parsed1.numerator!;
    const d1 = parsed1.denominator!;
    const parsed2 = parseFraction(frac2);
    if (!parsed2.isValid) throw new Error(parsed2.message);
    const n2 = parsed2.numerator!;
    const d2 = parsed2.denominator!;

    let resultNum, resultDen;

    switch (operation) {
        case "+":
            // 加法：n1/d1 + n2/d2 = (n1*d2 + n2*d1)/(d1*d2)
            resultNum = n1 * d2 + n2 * d1;
            resultDen = d1 * d2;
            break;
        case "-":
            // 减法：n1/d1 - n2/d2 = (n1*d2 - n2*d1)/(d1*d2)
            resultNum = n1 * d2 - n2 * d1;
            resultDen = d1 * d2;
            break;
        case "*":
            // 乘法：(n1*d2) * (n2*d1) → 直接 n1*n2 / d1*d2
            resultNum = n1 * n2;
            resultDen = d1 * d2;
            break;
        case "/":
            // 除法：(n1/d1) / (n2/d2) = (n1*d2)/(d1*n2)，需判断n2是否为0
            if (n2 === 0n) throw new Error("除数不能为0");
            resultNum = n1 * d2;
            resultDen = d1 * n2;
            break;
        default:
            throw new Error(`不支持的运算符：${operation}（仅支持 +、-、*、/）`);
    }

    // 步骤5：约分结果并转为字符串
    const [reducedNum, reducedDen] = reduceFraction(resultNum, resultDen);
    return `${reducedNum}/${reducedDen}`;
}