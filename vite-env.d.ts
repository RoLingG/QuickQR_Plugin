// 在 vite-env.d.ts 里要有这一段
declare module '*.svg' {
    const src: string
    export default src
}

declare module '*.png' {
    const src: string
    export default src
}