import CustomAPIError from "./custom-error.js"
import { StatusCodes } from "http-status-codes"
class ExternalAPIError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.BAD_GATEWAY
    }
}

export default ExternalAPIError