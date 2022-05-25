// TODO doc and explain this 
const isMongoDate = (value) => {
    return /\d{4}-\d{2}-\d{2}/.test(value)
}

module.exports = isMongoDate