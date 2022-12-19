class httpError extends Error{
    constructor(message, code) {
        super(message)
        this.message=message;
        this.code = code;
        this.name = 'httpError'
    }
}

module.exports = httpError;