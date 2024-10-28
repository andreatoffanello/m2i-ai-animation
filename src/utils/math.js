export function easeOutQuad(t) {
    return t * (2 - t);
}

export function easeInQuad(t) {
    return t * t;
}

export function cubicBezier(t, p0, p1, p2, p3) {
    const oneMinusT = 1 - t;
    return (
        p0 * oneMinusT * oneMinusT * oneMinusT +
        3 * p1 * t * oneMinusT * oneMinusT +
        3 * p2 * t * t * oneMinusT +
        p3 * t * t * t
    );
}

export function easeOutBounce(x) {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}

export function easeInBounce(x) {
    return 1 - easeOutBounce(1 - x);
}

// Costante per l'overshoot
const c1 = 1.70158;
const c3 = c1 + 1;

export function easeOutBack(x) {
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

export function easeInBack(x) {
    return c3 * x * x * x - c1 * x * x;
}
