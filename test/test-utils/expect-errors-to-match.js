/**
 * Compare 2 arrays of errors (all properties).
 * Jest by default does not compare anything but message value for Errors
 * */
function expectErrorsToMatch(received, expected) {
  expected = expected.map(getErrorEntriesPlusMessage);
  received = received.map(getErrorEntriesPlusMessage);
  expect(received).toEqual(expected);
}

// Object.entries() does not include properties up the prototype chain
function getErrorEntriesPlusMessage(err) {
  return [...Object.entries(err), ["message", err.message]];
}

module.exports = expectErrorsToMatch;
