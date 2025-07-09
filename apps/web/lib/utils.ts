export function getUptime(totalChecks:number, onlineChecks: number){
    return ((onlineChecks / totalChecks) * 100).toFixed(2)
}