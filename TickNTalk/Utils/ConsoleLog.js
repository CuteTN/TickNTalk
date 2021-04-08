export const consoleStyles = Object.freeze({
    Reset : "\x1b[0m",
    Bright : "\x1b[1m",
    Dim : "\x1b[2m",
    Underscore : "\x1b[4m",
    Blink : "\x1b[5m",
    Reverse : "\x1b[7m",
    Hidden : "\x1b[8m",

    FgBlack : "\x1b[30m",
    FgRed : "\x1b[31m",
    FgGreen : "\x1b[32m",
    FgYellow : "\x1b[33m",
    FgBlue : "\x1b[34m",
    FgMagenta : "\x1b[35m",
    FgCyan : "\x1b[36m",
    FgWhite : "\x1b[37m",

    BgBlack : "\x1b[40m",
    BgRed : "\x1b[41m",
    BgGreen : "\x1b[42m",
    BgYellow : "\x1b[43m",
    BgBlue : "\x1b[44m",
    BgMagenta : "\x1b[45m",
    BgCyan : "\x1b[46m",
    BgWhite : "\x1b[47m",
})

const DEBUG_MODE_ENABLED = true;
export const combineStyles = (...all) => all.reduce((a,b) => a + b)

const logInfoStyle = combineStyles(consoleStyles.Bright, consoleStyles.FgMagenta)
const logWarningStyle = combineStyles(consoleStyles.Bright, consoleStyles.FgYellow)
const logSuccessStyle = combineStyles(consoleStyles.Bright, consoleStyles.FgGreen)
const logErrorStyle = combineStyles(consoleStyles.Bright, consoleStyles.FgRed)
const logDebugStyle = combineStyles(consoleStyles.Bright, consoleStyles.FgCyan)

// info type could be "i" for info, "w" for waring, "s" for success, "e" for error
export const myLog = (info = "", breakLine = false, infoType = "s", addFrame = true, customStyle = null) => {
    // only log debug on debug mode
    if(infoType.toLowerCase() === "d" && !DEBUG_MODE_ENABLED)
        return

    let infoLabel = `[${infoType.toUpperCase()}]`
    let style = logInfoStyle

    switch(infoType.toLowerCase()) {
        case "i": style = logInfoStyle; break
        case "w": style = logWarningStyle; break
        case "s": style = logSuccessStyle; break
        case "e": style = logErrorStyle; break
        case "d": style = logDebugStyle; break
    }
    if(customStyle)
        style = customStyle

    const separateChar = breakLine || addFrame? '\n' : ' '

    // https://jrgraphix.net/r/Unicode/2500-257F
    const openFrame  = addFrame?      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓" : ""
    const closeFrame = addFrame? "\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛" : ""

    console.log(
        style 
        + infoLabel 
        + openFrame
        + separateChar 
        + info
        + closeFrame
        + consoleStyles.Reset
    )
}

export const logInfo = (info = "", breakLine = true, addFrame = true, customStyle = null) => myLog(info, breakLine, "i", addFrame, customStyle)
export const logWarning = (info = "", breakLine = false, addFrame = false, customStyle = null) => myLog(info, breakLine, "w", addFrame, customStyle)
export const logSuccess = (info = "", breakLine = false, addFrame = false, customStyle = null) => myLog(info, breakLine, "s", addFrame, customStyle)
export const logError = (info = "", breakLine = true, addFrame = true, customStyle = null) => myLog(info, breakLine, "e", addFrame, customStyle)
export const logDebug = (info = "", breakLine = false, addFrame = false, customStyle = null) => myLog(info, breakLine, "d", addFrame, customStyle)